export class LastfmClient {
  constructor(private readonly apiKey: string) {}

  public async fetchRecentTracks(
    username: string,
    page = 1
  ): Promise<TrackPointer[]> {
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&page=${page}&user=${username}&api_key=${this.apiKey}&format=json`
    );
    const data = await response.json();
    // deno-lint-ignore no-explicit-any
    return data.recenttracks.track
      .map((track: any) => {
        if (track["@attr"] && track["@attr"].nowplaying) {
          return null;
        }
        return {
          track: {
            name: track.name,
            artist: track.artist["#text"],
            album: track.album["#text"],
            date: this.timestampToDate(parseInt(track.date.uts)),
          },
          page,
        };
      })
      .filter((trackPointer: TrackPointer | null) => trackPointer !== null);
  }

  public getLibraryPageLink(username: string, page: number): string {
    return `https://www.last.fm/user/${username}/library?page=${page}`;
  }

  private timestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }
}

export interface Track {
  name: string;
  artist: string;
  album: string;
  date: Date;
}

export interface TrackPointer {
  track: Track;
  page: number;
}
