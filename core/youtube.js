const got = require('got');
const Pack = require('../package');

const PLAYLIST_ITEMS_MAX_RESULTS = 50;

// https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=PLlPn9MKk0K5HuCjbm3i0_JCnSuamvkugW&key=YOUR_API_KEY
// https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLlPn9MKk0K5HuCjbm3i0_JCnSuamvkugW&key=YOUR_API_KEY


async function getPlaylistName(playlistId, apiKey = Pack.app.api_key) {

    try {

        const response = await got('https://www.googleapis.com/youtube/v3/playlists', {
            json: true,
            query: {
                id: playlistId,
                key: apiKey,
                part: 'snippet'
            }
        });

        return response.body.items[0].snippet.title;

    } catch (e) {
        throw e;
    }

}

async function retrievePlaylistItems(playlistId, pageToken, apiKey = Pack.app.api_key) {

    try {

        const response = await got('https://www.googleapis.com/youtube/v3/playlistItems', {
            json: true,
            query: {
                playlistId: playlistId,
                key: apiKey,
                part: 'snippet',
                maxResults: PLAYLIST_ITEMS_MAX_RESULTS,
                pageToken: pageToken || undefined
            }
        });

        return response.body;

    } catch (e) {
        throw e;
    }

}

async function getPlaylistItems(playlistId) {

    var items = [];

    var per = PLAYLIST_ITEMS_MAX_RESULTS;
    var totalResults = per - 1;
    var pageToken;
    var page = 0;

    try {

        do {
            const data = await retrievePlaylistItems(playlistId, pageToken);

            pageToken = data.nextPageToken;
            items = [...items, ...data.items];
            totalResults = data.pageInfo.totalResults;

            page++;
        }
        while (page < Math.ceil(totalResults / per));

        return items.map(item => {
            return {
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                position: item.snippet.position
            };
        });;

    } catch (e) {
        throw e;
    }

}

module.exports = {
    getPlaylistName: getPlaylistName,
    getPlaylistItems: getPlaylistItems
};