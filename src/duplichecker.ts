import { Track, TrackPointer } from "./lastfm.ts";

/**
 * Find double scrobbles in a list of tracks.
 *
 * A double scrobble is defined as two tracks with the same name and same artist played
 * within a certain threshold of each other.
 *
 * The algorithm works by sorting the tracks by date, and then iterating through the list.
 * For each track, it fetches all tracks within the threshold of the current track.
 * If any of those tracks are probably double scrobbles, they are added to the list of doubles.
 *
 * The problem is that I want to find all double scrobbles, not only the consecutive ones.
 * In fact, it happened to me, quite often, that Spotify would scroble a track twice, but in a kind
 * of interleaved way. For example, I would listen to track A, then track B, then track A again.
 *
 * The algorithm is O(n^2) in the worst case, but in practice it is much faster, because
 * the number of tracks within the threshold is usually very small, if not zero.
 *
 * @param tracks The list of tracks to check for double scrobbles.
 * @param threshold The number of seconds between tracks to consider a double scrobble.
 * @returns
 */
export function findDoubleScrobbles(
  tracks: TrackPointer[],
  threshold: number
): Array<[TrackPointer, TrackPointer]> {
  const doubles = new Array<[TrackPointer, TrackPointer]>();
  // Sort tracks by date
  tracks.sort((a, b) => a.track.date.getTime() - b.track.date.getTime());
  let i = 0;
  while (i + 1 < tracks.length) {
    const trackPointer = tracks[i];
    // Fetch all tracks in the threshold from the current track.
    const thresholdTracks = tracks
      .slice(i + 1)
      .filter(
        (track) =>
          Math.abs(
            track.track.date.getTime() - trackPointer.track.date.getTime()
          ) <
          threshold * 1000
      );

    for (const testTrack of thresholdTracks) {
      if (
        isProbablyDoubleScobble(trackPointer.track, testTrack.track, threshold)
      ) {
        doubles.push([trackPointer, testTrack]);
      }
    }
    i++;
  }
  return doubles;
}

/**
 * A simple heuristic to determine if two tracks are probably double scrobbles.
 *
 * It is based on the assumption that two tracks are probably double scrobbles if they have the same name,
 * and are played within a certain threshold of each other.
 *
 * Probably I could consider the artist as well, but I think it is not really frequent to have two tracks
 * with the same title and different artists in quick succession.
 *
 * I could also consider to use a fuzzy string matching algorithm to compare the track names. This may be
 * a future improvement if I find that the current heuristic is not good enough.
 *
 * @param trackA The test track.
 * @param trackB The track to compare with.
 * @param threshold The number of seconds between tracks to consider a double scrobble.
 * @returns
 */
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
