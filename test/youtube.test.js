const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();

const { getPlaylistName, getPlaylistItems } = require('../core/youtube');

describe('Youtube Api', () => {

    const playlistId = "PLlPn9MKk0K5HuCjbm3i0_JCnSuamvkugW";
    const playlistName = "Mixed Songs";
    const playlistSize = 9;

    it('fails on invalid api key', async () => {

        try {

            const name = await getPlaylistName(playlistId, "This_Is_Invalid_Api_Key");

        } catch (e) {

            expect(e.statusCode).to.equal(400);

        }

    });

    it('get playlist name', async () => {

        const name = await getPlaylistName(playlistId);

        expect(typeof name).to.be.equal("string");
        expect(name).to.equal(playlistName);
    });

    it('get playlist items', async () => {

        const items = await getPlaylistItems(playlistId);

        expect(items instanceof Array).to.equal(true);
        expect(items.length).to.equal(playlistSize);
    });
});
