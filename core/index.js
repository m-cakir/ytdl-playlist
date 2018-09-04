const program = require('commander');
const { Playlist } = require('./playlist');
const { getPlaylistName, getPlaylistItems } = require('./youtube');
const { download } = require('./download');

program
    .version('1.0.0', '-v, --version')
    .description('Youtube playlist downloader');

program
    .usage('[options]')
    .option('-u, --url <url>', 'youtube playlist url (overrides "id" option)')
    .option('-i, --id <id>', 'youtube playlist id')
    .option('-f, --format <format>', 'output format (video || audio)', /^(video|audio)$/i, 'video')
    .option('-o, --output <output>', 'output folder name (default: playlist name)')
    .option('-r, --range <a>-<b>', 'items range, must be like a-b', function (val) { return val.split('-').map(Number); })
    .option('-j, --json <json>', 'options from .json file (overrides other options)');

program.parse(process.argv);

const playlist = Playlist.parseFromCmd(program);

(async function () {

    try {

        if (!playlist.output) {

            playlist.output = await getPlaylistName(playlist.id);

        }

        playlist.validate();

        playlist.items = await getPlaylistItems(playlist.id);

        playlist.print();

        console.log("### task started");
        console.log("-".repeat(3));

        playlist.makeDir();

        console.log("-".repeat(3));

        try {

            download(playlist)
                .then(function (error) {
                    console.log("### task completed successfully");
                });

        } catch (e) {
            console.log(e);
            console.log("-".repeat(3));
            console.log("### task incompleted");
        }

    } catch (e) {
        console.log("### Something has gone wrong, e: " + e);
    }

})();
