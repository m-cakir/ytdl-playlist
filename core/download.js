const fs = require('fs');
const Async = require('async');
const Ytdl = require('ytdl-core');
const FFmpeg = require('fluent-ffmpeg');
const Clui = require('clui');
const Progress = Clui.Progress;

function downloadVideo(playlistItem, outputFilePath, callback) {

    try {

        var percentBar = new Progress(20);

        const url = 'https://www.youtube.com/watch?v=' + playlistItem.videoId;
        const stream = Ytdl(url, { filter: (format) => format.container === 'mp4' });
        stream.pipe(fs.createWriteStream(outputFilePath));
        stream.on('progress', (chunkLength, downloaded, total) => {
            const floatDownloaded = downloaded / total;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write("--- " + percentBar.update(floatDownloaded));
        });
        stream.on('error', (e) => {
            fs.unlinkSync(outputFilePath); // remove file on error
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("--- " + e);
            callback();
        });
        stream.on('end', () => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("--- downloaded...");
            callback();
        });

    } catch (e) {
        console.log("--- " + e);
        callback();
    }

}

function downloadAudio(playlistItem, outputFilePath, callback) {

    try {

        var percentBar = new Progress(20);

        const url = 'https://www.youtube.com/watch?v=' + playlistItem.videoId;
        const stream = Ytdl(url, { quality: 'highestaudio' });

        stream.on('progress', (chunkLength, downloaded, total) => {
            const floatDownloaded = downloaded / total;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write("--- " + percentBar.update(floatDownloaded));
        });
        stream.on('error', (e) => {
            fs.unlinkSync(outputFilePath); // remove file on error
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("--- " + e);
            callback();
        });
        stream.on('end', () => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("--- downloaded...");
            callback();
        });

        FFmpeg(stream)
            .audioBitrate(192) // 128, 192, 256, 320
            .save(outputFilePath);

    } catch (e) {
        console.log("--- " + e);
        callback();
    }

}

function download(playlist) {

    Async.eachLimit(playlist.items, 1, function (item, callback) {

        const position = item.position + 1;

        if (playlist.range)
            if (position < playlist.range[0] || (playlist.range[1] && position > playlist.range[1])) {
                callback();
                return;
            }

        const extension = playlist.isVideo() ? 'mp4' : 'mp3';
        const pathName = playlist._arrangePathName(item.title);
        const output = `${playlist.getDirPath()}/${pathName}.${extension}`.trim();
        console.log("--- " + position + " _ " + item.title);

        if (item.title.toLowerCase() == "private video") { // should be more clever than this check :(
            console.log("--- This content is PRIVATE");
            callback();
            return;
        }

        if (playlist.isVideo())
            downloadVideo(item, output, callback);
        else
            downloadAudio(item, output, callback);

    }, function (error) {
        if (error) {
            console.log(error);
            console.log("---");
            console.log("--- task incompleted...");
        } else {
            console.log("---");
            console.log("--- task completed successfully...");
        }
    });

}

module.exports.download = download;