import { loadMetadataFromMusicFile } from '@/src/music';

import { ParseStatisticsConfig, ParsingResult } from './play-statistics.type';

export const parseStatisticsFromFile = async (path: string, config: ParseStatisticsConfig) => {
  const rawData = await Bun.file(path).text();

  const entries = rawData.split('\n');
  console.info(`Parsing ${entries.length} entries...`);

  const results: ParsingResult[] = [];
  for (const entry of entries) {
    try {
      const entryData = entry.split(';');
      const playCount = entryData[0];
      const filePath = entryData[5];
      if (!playCount) {
        continue;
      }

      const cleanedPath = filePath.replace(config.inputRoot, config.outputRoot);
      const { albumArtist, albumName, artistName, duration, trackName } = await loadMetadataFromMusicFile(cleanedPath);

      const playEntries = Array(parseInt(playCount)).fill({
        albumArtist,
        albumName,
        artistName,
        duration,
        trackName,
      });

      results.push(...playEntries);
    } catch (err) {
      console.error(`Unable to parse entry, ${err.message}`);
    }
  }

  Bun.write('./output/results.json', JSON.stringify(results));
  console.info('Finished parsing data.');
};
