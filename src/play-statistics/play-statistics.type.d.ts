export type ParsingResult = {
  albumArtist: string;
  albumName: string;
  artistName: string;
  duration: string;
  trackName: string;
};

export type ParseStatisticsConfig = {
  inputRoot: string;
  outputRoot: string;
};
