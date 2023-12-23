# Unscrobbler

As a dedicated [Last.fm](https://www.last.fm/) user, I obsessively curate my Last.fm history. Unfortunately, it is not a smooth process. Often, applications like Spotify or Apple Music will not scrobble to Last.fm or they manually scrobble the same song twice, or pollute my library with "Remastered", "2022 Mix" or other useless information.

After spending too much time manually checking for duplicates, I decided to write a script to automate the process. This script will check your Last.fm library for duplicate scrobbles and provide a handy link for deleting them. It will also identify any scrobbles that contain a specific string, such as "Remastered" or "XXXX Mix".

## Will this delete my scrobbles?

No. There are no official Last.fm APIs for deleting scrobbles, so this script will only provide a link to the scrobble page. Some other similar scripts can delete scrobbles by spawning a headless browsers and parsing the DOM. Honestly, unless you have to delete hundreds of scrobbles, it's probably easier to just delete them manually.

## Pre-requisites

- [Deno](https://deno.land/)

## Usage

1. Clone this repository.
2. Get a [Last.fm API key](https://www.last.fm/api/account/create).
3. Run `deno run --allow-net unscrobbler.ts --username <your_username> --api-key <your_API_key> --from-page 1 --to-page 3`
