import { Track, TrackPointer } from "./lastfm.ts";

export function findRemastered(tracks: TrackPointer[]): Array<TrackPointer> {
  const remastered = new Array<TrackPointer>();
  for (const trackPointer of tracks) {
    if (hasRemasteredTag(trackPointer.track)) {
      remastered.push(trackPointer);
    }
  }
  return remastered;
}

function hasRemasteredTag(track: Track): boolean {
  // Regex for [YYYY Remastered YYYY] or (YYYY Remastered YYYY)
  const remasteredRegex =
    /\[(\d{4}\s)?Remastered\s?(\d{4})?\]|\((\d{4}\s)?Remastered\s?(\d{4})?\)/;

  return track.name.match(remasteredRegex) !== null;
}
