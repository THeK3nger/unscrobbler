import { Track, TrackPointer } from "./lastfm.ts";

export function findDoubleScrobbles(
  tracks: TrackPointer[]
): Array<[TrackPointer, TrackPointer]> {
  const doubles = new Array<[TrackPointer, TrackPointer]>();
  // Sort tracks by date
  tracks.sort((a, b) => a.track.date.getTime() - b.track.date.getTime());
  let i = 0;
  while (i + 1 < tracks.length) {
    const trackPointer = tracks[i];
    const nextTrack = tracks[i + 1];
    if (isProbablyDoubleScobble(trackPointer.track, nextTrack.track)) {
      doubles.push([trackPointer, nextTrack]);
    }
    i++;
  }
  return doubles;
}

function isProbablyDoubleScobble(
  trackA: Track,
  trackB: Track,
  threshold = 240
): boolean {
  return (
    trackA.name === trackB.name &&
    Math.abs(trackA.date.getTime() - trackB.date.getTime()) < threshold * 1000
  );
}
