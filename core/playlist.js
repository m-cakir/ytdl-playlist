const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const PLAYLIST_SCHEMA = Joi.object().keys({
    id: Joi.string().when('url', {
        is: Joi.string().regex(/(list=)/i),
        otherwise: Joi.required()
    }),
    url: Joi.string().uri(),
    range: Joi.array().min(1).max(2).items(Joi.number(), Joi.number()),
    format: Joi.string().regex(/^(video|audio)$/i),
    output: Joi.string()
}).without('id', 'url').or('id', 'url');

class Playlist {

    constructor(format, id, range, output) {
        this.format = format;
        this.id = id;
        this.output = output;
        this.range = range;
    }

    static get schema() {
        return PLAYLIST_SCHEMA;
    }

    get range() {
        return this._range;
    }

    set range(value) {
        if (value) {
            if (!(value instanceof Array))
                throw new Error("Please enter valid range object array");
        }
        this._range = value;
    }

    get items() {
        return this._items;
    }

    set items(list) {
        if (list) {
            if (!(list instanceof Array))
                throw new Error("Please enter valid items object array");
        }
        this._items = list;
    }

    static parseFromCmd({ url, format, id, range, json: jsonFilePath, output }) { // program object

        var data = {
            format: format,
            output: output
        };

        if (id) data.id = id;
        if (range) data.range = range;
        if (url) data.url = url;

        if (jsonFilePath) {
            data = Object.assign(data, require(jsonFilePath));
        }

        if (data.url) data.id = data.url.split('list=')[1].split('&')[0];

        let { _url, ...parameters } = data;

        return Playlist.parseFromObject(parameters);
    }

    static parseFromObject({ format, id, range, output }) {
        return new Playlist(format, id, range, output);
    }

    getFolderName() {
        if (!this.output) throw new Error("Invalid playlist or output folder name");
        return this._arrangePathName(this.output);
    }

    makeDir() {
        const downloadDir = this.getDownloadsFolderPath();
        if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

        const playlistDir = this.getDirPath();
        if (!fs.existsSync(playlistDir)) fs.mkdirSync(playlistDir);
    }

    getDownloadsFolderPath() {
        return path.resolve(__dirname, '../downloads');
    }

    getDirPath() {
        return path.resolve(__dirname, '../downloads/' + this.getFolderName());
    }

    validate() {

        const result = Joi.validate(this.toJSON(), PLAYLIST_SCHEMA);

        if (result.error !== null) {
            throw new Error("Please enter a valid playlist info with ID or URL");
        }
    }

    toJSON() {
        return {
            id: this.id,
            format: this.format,
            range: this.range,
            output: this.output
        };
    }

    _arrangePathName(str) {
        return str.replace(/[\\\/\:\*\?\"\<\>\|\']/g, " ").replace(/\s\s+/g, ' ').trim();
    }

    isVideo() {
        return this.format === 'video';
    }

    print() {
        console.log("-".repeat(8) + " playlist info " + "-".repeat(8));
        console.log(" > id     \t: " + this.id);
        console.log(" > format \t: " + this.format);
        if (this.range)
            console.log(" > range \t: " + this.range[0] + "-" + (this.range[1] || this.range[0]));
        console.log(" > output dir \t: downloads/" + this.getFolderName());
        console.log(" > total items \t: " + this.items.length);
        console.log("-".repeat(31));
    }
}

module.exports.Playlist = Playlist;