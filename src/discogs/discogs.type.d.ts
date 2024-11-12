export type SearchResults = {
  results: SearchResultEntry[];
};

type SearchResultEntry = {
  id: number;
};

export type ReleaseResult = {
  artists: Artist[];
  tracklist: Track[];
};

type Artist = {
  name: string;
};

export type Track = {
  position: string;
  type_: string;
  title: string;
  duration: string;
};
