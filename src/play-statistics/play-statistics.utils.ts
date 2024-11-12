import Fuse from 'fuse.js';

import { DiscogsRepository, Track } from '@/src/discogs';

import { ParsingResult } from './play-statistics.type';

export const parseStatisticsFromFile = async (path: string) => {
  const rawData = await Bun.file(path).text();
  const discogsRepository = new DiscogsRepository();

  const entries = rawData.split('\n');
  console.info(`Parsing ${entries.length} entries...`);

  const results: ParsingResult[] = [];
  const leftovers: Omit<ParsingResult, 'albumArtist' | 'duration'>[] = [];
  for (const entry of entries) {
    try {
      const [playCount, _, trackName, artistName, albumName] = entry.split(';');
      if (!playCount) {
        continue;
      }

      const result = await discogsRepository.getSearchResultsByTitleAndArtist(albumName, artistName);

      const playEntries = Array(parseInt(playCount)).fill({
        albumName,
        artistName,
        trackName,
      });

      const releaseId = result?.results?.[0]?.id;
      if (!releaseId) {
        leftovers.push(...playEntries);
        continue;
      }

      const release = await discogsRepository.getReleaseById(releaseId);
      if (!release) {
        leftovers.push(...playEntries);
        continue;
      }

      const albumArtist = release.artists[0].name;
      const matchingTrack = getMatchingTrackFromName(trackName, release.tracklist);
      if (!matchingTrack) {
        leftovers.push(...playEntries);
        continue;
      }

      const duration = padDuration(matchingTrack.duration);
      results.push(
        ...playEntries.map(e => ({
          ...e,
          albumArtist,
          duration,
        })),
      );
    } catch (err) {
      console.error(`Unable to parse entry, ${err.message}`);
    }
  }

  Bun.write('./output/results.json', JSON.stringify(results));
  Bun.write('./output/leftovers.json', JSON.stringify(leftovers));
};

const getMatchingTrackFromName = (trackName: string, tracks: Track[]): Track | undefined => {
  const fuse = new Fuse(tracks, {
    keys: ['title'],
  });

  return fuse.search(trackName)[0]?.item;
};

const padDuration = (duration: string): string => {
  if (duration.length > 4) {
    return duration;
  }

  return `0${duration}`;
};
