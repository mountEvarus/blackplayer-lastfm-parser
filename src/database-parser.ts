import { ReadStream, createReadStream, existsSync, mkdirSync, writeFile } from "fs"

import { Parser, parse } from "csv-parse"
import * as mm from "music-metadata"

type Database = {
  albumArtist?: string
  albumName?: string
  artistName?: string
  duration?: string
  path?: string
  raw: string
  playCount?: string
  trackName?: string
  trackNumber?: string
}[]

type ParserOptions = {
  fileParsingRoot?: string
  originRoot?: string
}

type EnrichFailure = {
  message: string
  path?: string
  raw: string
}

export class DatabaseParser {
  private _database: Database = []
  private _options: ParserOptions = {}
  private _enrichFailures: EnrichFailure[] = []

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(databaseSteam: ReadStream, options: ParserOptions) {
    this._options = options
    databaseSteam.pipe(this.parser())
  }

  static loadFromPath = (path: string, options: ParserOptions = {}) => {
    const databaseStream = createReadStream(path)

    return new DatabaseParser(databaseStream, options)
  }

  private parser = (): Parser => parse({ delimiter: ";", relaxQuotes: true }, (err, data) => {
    if (err) {
      throw Error(err.message)
    }

    const rawDatabase = data as string[][]

    rawDatabase.forEach(entry => {
      const playCount = entry[0]
      const trackName = entry[3]
      const path = this.cleanPath(entry[5])

      const cleanedEntry = {
        path,
        playCount,
        raw: entry.join(";"),
        trackName,
      }

      this._database.push(cleanedEntry)
    })
  })

  private cleanPath = (path?: string) => {
    if (!path || !this._options.fileParsingRoot || !this._options.originRoot) {
      return
    }

    return path.replace(this._options.originRoot, this._options.fileParsingRoot)
  }

  public enrichEntries = async () => {
    const entries: Database = []

    for (const entry of this._database) {
      if (!entry.path) {
        this._enrichFailures.push({
          message: "No entry found.",
          raw: entry.raw,
        })
      }

      try {
        const parsedData = await mm.parseFile(entry.path as string, { duration: true })

        const { album: albumName, albumartist: albumArtist, artist: artistName, title: trackName, ...rest } = parsedData.common
        const duration = this.getDurationFromMs(parsedData.format.duration)

        for (let i = 0; i < parseInt(entry.playCount ?? ""); i++) {
          entries.push({
            albumArtist,
            albumName,
            artistName,
            duration,
            raw: entry.raw,
            trackName,
          })
        }
      } catch({ message }) {
        this._enrichFailures.push({
          message: `Enrichment failed for ${entry.path ?? "UNKNOWN"}: ${message as string}`,
          raw: entry.raw,
        })
      }
    }
    this._database = entries
  }

  public getDurationFromMs = (duration?: number): string | undefined => {
    if(!duration) {
      return "00:00:00"
    }

    const hours = Math.floor(duration/60/60)
    const minutes = Math.floor((duration/60/60 - hours)*60)
    const seconds = Math.floor(((duration/60/60 - hours)*60 - minutes)*60)

    return `${hours}:${minutes}:${seconds}`
  }

  public writeDatabase = () => {
    if(!existsSync("./output")) {
      mkdirSync("./output")
    }

    writeFile("./output/db.json", JSON.stringify(this._database, null, 2), (err: unknown) => {
      console.log("DB Entries:", this._database.length)
      err ?console.error(err) : console.log("Database written to output/db.json")
    })
    writeFile("./output/errors.json", JSON.stringify(this._enrichFailures, null, 2), (err: unknown) => {
      console.log("Errors:", this._enrichFailures.length)
      err ?console.error(err) : console.log("Failures written to output/errors.json")
    })
    writeFile("./output/leftover.csv", this._enrichFailures.map(failure => failure.raw).join("\n"), (err: unknown) => {
      err ?console.error(err) : console.log("Leftovers written to output/leftovers.csv")
    })
  }
}
