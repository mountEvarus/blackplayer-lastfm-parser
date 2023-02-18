import { DatabaseParser } from "./database-parser"

const start = async () => {
  const path = `${__dirname}/db.csv`
  const database = DatabaseParser.loadFromPath(path, {
    originRoot: "/storage/emulated/0/Music/",
    fileParsingRoot: "../Music/",
  })

  await new Promise(res => setTimeout(res, 1000))
  await database.enrichEntries()
  database.writeDatabase()
}

void start()
