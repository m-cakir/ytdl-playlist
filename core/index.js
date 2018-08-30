const program = require('commander');
const { Playlist } = require('./playlist');
const { getPlaylistName, getPlaylistItems } = require('./youtube');
const { download } = require('./download');

program
    .version('1.0.0', '-v, --version')
    .description('Youtube playlist downloader');

program
    .usage('[options]')
    .option('-i, --id <id>', 'playlist id')
    .option('-n, --name <name>', 'playlist name')
    .option('-t, --type <type>', 'output type: video or audio', /^(video|audio)$/i, 'video')
    .option('-o, --outputdir <outputdir>', 'output directory name', 'downloads')
    .option('-r, --range <a>..<b>', 'playlist items range', function (val) { return val.split('..').map(Number); })
    .option('-j, --json <json>', 'options from .json file (overrides other options)');

program.parse(process.argv);

const playlist = Playlist.parseFromCmd(program);

(async function () {

    try {

        if (!playlist.name) {

            playlist.name = await getPlaylistName(playlist.id);

        }

        playlist.validate();

        playlist.items = await getPlaylistItems(playlist.id);

        console.log("--- playlist info ---");
        console.log("---");
        console.log("--- id: " + playlist.id);
        console.log("--- name: " + playlist.name);
        console.log("--- type: " + playlist.type);
        if (playlist.range) console.log("--- range: " + playlist.range[0] + "-" + playlist.range[1]);
        console.log("--- output dir: " + playlist.outputdir);
        console.log("--- total items: " + playlist.items.length);
        console.log("---");
        console.log("--- task started...");
        console.log("---");

        playlist.makeDir();

        download(playlist);

    } catch (e) {
        console.log("Something has gone wrong, e: " + e);
    }

})();
