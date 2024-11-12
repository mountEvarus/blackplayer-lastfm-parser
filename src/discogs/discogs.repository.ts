import { fetch } from 'bun';

import { DISCOGS_API_KEY, DISCOGS_API_SECRET } from '@/src/env';

import { ReleaseResult, SearchResults } from './discogs.type';

export class DiscogsRepository {
  private rootUrl = 'https://api.discogs.com';

  private getAuthHeaders = () => {
    if (!DISCOGS_API_KEY || !DISCOGS_API_SECRET) {
      throw new Error('No API credentials provided.');
    }

    return {
      Authorization: `Discogs key=${DISCOGS_API_KEY}, secret=${DISCOGS_API_SECRET}`,
    };
  };

  getSearchResultsByTitleAndArtist = async (title: string, artist: string): Promise<SearchResults | undefined> => {
    try {
      const res = await fetch(`${this.rootUrl}/database/search?artist=${artist}&release_title=${title}&type=release`, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      console.log({ res });

      return (await res.json()) as SearchResults;
    } catch (err) {
      console.warn(`Unable to fetch discogs data - ${err.message}`);
      return undefined;
    }
  };

  getReleaseById = async (releaseId: number): Promise<ReleaseResult | undefined> => {
    try {
      const res = await fetch(`${this.rootUrl}/releases/${releaseId}`, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      return (await res.json()) as ReleaseResult;
    } catch (err) {
      console.warn(`Unable to fetch discogs data - ${err.message}`);
      return undefined;
    }
  };
}
