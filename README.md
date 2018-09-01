# Youtube Playlist Downloader

Downlad Youtube playlist videos as video or audio with command line tool.

### Prerequisites

```
node >= 8.9.0
ffmpeg (for audio)
```

### Built With

* [Node](https://nodejs.org) - Javascript run-time environment
* [Youtube Data Api](https://developers.google.com/youtube/v3/docs/) Youtube Data Api
* [Ytdl Core](https://github.com/fent/node-ytdl-core) YouTube video downloader in javascript
* [FFMPEG](https://ffmpeg.org/download.html) - Multimedia framework, able to decode, encode, transcode, vs.
* [Fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) A fluent API to FFMPEG
* [Got](https://github.com/sindresorhus/got) Simplified HTTP requests
* [Joi](https://github.com/hapijs/joi) Object schema validation
* [Commander](https://github.com/tj/commander.js) Node.js command-line interfaces made easy
* [Clui](https://github.com/nathanpeck/clui) Command-line UI toolkit for Node.js

### Install

clone this repo, then
```
npm install
```

## Usage

`node index [options]`

__Options__

       -v, --version                  show version number
       -h, --help                     show help
       -t, --type                     the output format, can be video or audio, default: video
       -o, --outputdir                the output folder name, default: downloads
       -i, --id                       playlist id
       -n, --name                     playlist name (to use folder name)
       -r, --range                    playlist items range, should be like <a>..<b>
       -j, --json                     options from .json file (overrides other options)

__Examples__

// Todo
