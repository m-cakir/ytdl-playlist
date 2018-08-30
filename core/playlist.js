const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const PLAYLIST_SCHEMA = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string(),
    range: Joi.array().min(1).max(2).items(Joi.number(), Joi.number()),
    type: Joi.string(),
    outputdir: Joi.string()
});

class Playlist {

    constructor(type, id, name, range, outputdir) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.outputdir = outputdir;
        this.range = range;
    }

    get range() {
        return this._range;
    }

    set range(value) {
        if (value) {
            if (!(value instanceof Array))
                throw new Error("Please enter valid a range object array");
        }
        this._range = value;
    }

    get items(){
        return this._items;
    }

    set items(list){
        if (list) {
            if (!(list instanceof Array))
                throw new Error("Please enter valid a items object array");
        }
        this._items = list;
    }

    static parseFromCmd({ type, id, name, range, json: jsonFilePath, outputdir }) { // program object

        var data = {};

        data.type = type;
        data.outputdir = outputdir;

        if (id) data.id = id;
        if (typeof name === 'string' && name) data.name = name;
        if (range) data.range = range;

        if (jsonFilePath) {
            data = Object.assign(data, require(jsonFilePath));
        }

        return Playlist.parseFromObject(data);
    }

    static parseFromObject({ type, id, name, range, outputdir }) {
        return new Playlist(type, id, name, range, outputdir);
    }

    getFolderName() {
        if (!this.name) throw new Error("Invalid playlist name");
        return this._arrangePathName(this.name);
    }

    makeDir() {
        const downloadDir = this.getDownloadsFolderPath();
        if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

        const playlistDir = this.getDirPath();
        if (!fs.existsSync(playlistDir)) fs.mkdirSync(playlistDir);
    }

    getDownloadsFolderPath() {
        return path.resolve(__dirname, '..' + path.sep + this.outputdir);
    }

    getDirPath() {
        return path.resolve(__dirname, '..' + path.sep + this.outputdir + path.sep + this.getFolderName());
    }

    validate() {

        const result = Joi.validate(this.toJSON(), PLAYLIST_SCHEMA);

        if (result.error !== null) {
            throw new Error("Please enter a valid playlist info with id");
        }
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            range: this.range,
            outputdir: this.outputdir
        };
    }

    _arrangePathName(name) {
        return name.replace(/[\\\/\:\*\?\"\<\>\|\']/g, " ").replace(/\s\s+/g, ' ').trim();
    }

    isVideo(){
        return this.type === 'video';
    }

}

module.exports.Playlist = Playlist;