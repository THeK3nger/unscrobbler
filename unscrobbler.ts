import { parseArgs } from "https://deno.land/std@0.208.0/cli/parse_args.ts";
import * as mod from "https://deno.land/std@0.208.0/fmt/colors.ts";

import { findRemastered } from "./src/detag.ts";
import { findDoubleScrobbles } from "./src/duplichecker.ts";
import { LastfmClient, TrackPointer } from "./src/lastfm.ts";

// Main
async function main() {
  const args = parseArgs(Deno.args, {
    string: [
      "username",
      "api-key",
      "from-page",
      "to-page",
      "threshold",
      "type",
    ],
    default: {
      "from-page": "1",
      "to-page": "1",
      threshold: "240",
      type: "double", // double, tags
    },
  });

  if (!args["username"] || !args["api-key"]) {
    console.log("Please provide a username and api-key");
    Deno.exit(1);
  }

  const lastfm = new LastfmClient(args["api-key"]);
  const tracks = await fetchTracks(lastfm, args["username"], {
    from: parseInt(args["from-page"]),
    to: parseInt(args["to-page"]),
  });

  console.log(`Found ${tracks.length} tracks`);

  if (args["type"] === "double") {
    doubleScrobbles(
      lastfm,
      tracks,
      args["username"],
      Number.parseInt(args["threshold"])
    );
  } else if (args["type"] === "tags") {
    taggedTracks(lastfm, tracks, args["username"]);
  }
}

async function fetchTracks(
  lastfm: LastfmClient,
  username: string,
  pagination: { from: number; to: number }
): Promise<Array<TrackPointer>> {
  const tracks = new Array<TrackPointer>();
  for (let page = pagination.from; page <= pagination.to; page++) {
    const pageTracks = await lastfm.fetchRecentTracks(username, page);
    tracks.push(...pageTracks);
  }

  return tracks;
}

function doubleScrobbles(
  lastfm: LastfmClient,
  tracks: TrackPointer[],
  username: string,
  threshold = 240
) {
  const doubles = findDoubleScrobbles(tracks, threshold);
  console.log(mod.red(`Found ${doubles.length} double scrobbles`));
  for (const d of doubles) {
    console.log(
      "\t-",
      mod.yellow(`Page ${d[0].page}`),
      d[0].track.name,
      d[0].track.artist,
      `Time difference: ${
        Math.abs(d[0].track.date.getTime() - d[1].track.date.getTime()) / 1000
      } seconds.`,
      lastfm.getLibraryPageLink(username, d[0].page)
    );
  }
}

async function taggedTracks(
  lastfm: LastfmClient,
  tracks: TrackPointer[],
  username: string
) {
  const remasteredTaggedTracks = findRemastered(tracks);
  console.log(
    mod.red(`Found ${remasteredTaggedTracks.length} remastered tagged tracks`)
  );
  for (const t of remasteredTaggedTracks) {
    console.log(
      "\t-",
      mod.yellow(`Page ${t.page}`),
      t.track.name,
      t.track.artist,
      lastfm.getLibraryPageLink(username, t.page)
    );
  }
}

if (import.meta.main) {
  await main();
}
