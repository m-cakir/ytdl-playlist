const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();

const Joi = require('joi');
const { Playlist } = require('../core/playlist');
const schema = Playlist.schema;

describe('Playlist Schema', () => {

    const playlistID = "PLlPn9MKk0K5HuCjbm3i0_JCnSuamvkugW";
    const playlistURL = "https://www.youtube.com/watch?v=9OIjPKLuu5g&list=PLlPn9MKk0K5HuCjbm3i0_JCnSuamvkugW&index=10&t=0s";

    it('should be valid object only with "id"', async () => {

        const playlist = {
            "id": playlistID
        };

        const result = Joi.validate(playlist, schema);

        expect(result.error).to.be.null();

    });

    it('should be valid object only with "url"', async () => {

        const playlist = {
            "url": playlistURL
        };

        const result = Joi.validate(playlist, schema);

        expect(result.error).to.be.null();

    });

    it('should be valid object with "id"', async () => {

        const playlist = {
            "id": playlistID,
            "range": [3, 9],
            "format": "video",
            "output": "output-folder"
        };

        const result = Joi.validate(playlist, schema);

        expect(result.error).to.be.null();

    });

    it('should be valid object with "url"', async () => {

        const playlist = {
            "url": playlistURL,
            "range": [1, 9],
            "format": "audio",
            "output": "output-folder"
        };

        const result = Joi.validate(playlist, schema);

        expect(result.error).to.be.null();

    });

    it('should be invalid object with "url" and "id" properties', async () => {

        const playlist = {
            "id": playlistID,
            "url": playlistURL,
            "range": [1, 9],
            "format": "audio",
            "output": "output-folder"
        };

        const result = Joi.validate(playlist, schema);

        expect(result.error).to.be.not.null();

    });

    it('should be invalid object without "url" and "id" properties', async () => {

        const playlist = {
            "range": [1, 9],
            "format": "audio",
            "output": "output-folder"
        };

        const result = Joi.validate(playlist, schema);

        expect(result.error).to.be.not.null();

    });

});
