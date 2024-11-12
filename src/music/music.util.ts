import { parseFile } from 'music-metadata';

export const loadMetadataFromMusicFile = async (path: string) => {
  const parsedData = await parseFile(path, { duration: true });
  const {
    albumartist: albumArtist,
    album: albumName,
    artist: artistName,
    title: trackName,
    ...rest
  } = parsedData.common;
  const rawDuration = parsedData.format.duration;

  return {
    albumArtist,
    albumName,
    artistName,
    duration: getDurationFromSeconds(rawDuration),
    trackName,
    rest,
  };
};

const getDurationFromSeconds = (duration?: number): string | undefined => {
  if (!duration) {
    return '00:00:00';
  }

  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration / 60 / 60 - hours) * 60);
  const seconds = Math.floor(((duration / 60 / 60 - hours) * 60 - minutes) * 60);

  return `${hours}:${minutes}:${seconds}`;
};
