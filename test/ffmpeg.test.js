const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();

const FFmpeg = require('fluent-ffmpeg');
const path = require('path');

describe('FFMPEG', () => {

    it('should be valid ffmpeg in the PATH', function (done) {
        var ff = new FFmpeg();

        ff._forgetPaths();
        ff._getFfmpegPath(function (err, ffmpeg) {

            expect(err).to.be.null();

            expect(typeof ffmpeg).to.be.equal("string");
            expect(ffmpeg.length).to.be.above(0);

            var paths = process.env.PATH.split(path.delimiter || (require('os').platform().match(/win(32|64)/) ? ';' : ':'));

            expect(paths.indexOf(path.dirname(ffmpeg))).to.be.above(-1);
        });
    });

});
