const mongoose = require('mongoose');

const songSchema = mongoose.Schema(
    {
        name: {
            type: 'string',
            required: true,
        },
        image: {
            type: 'string',
            required: true,
        },
        songUrl: {
            type: 'string',
            required: true,
        },
        album: {
            type: 'string',
        },
        artist: {
            type: 'string',
            required: true,
        },
        language: {
            type: 'string',
            required: true,
        },
        category: {
            type: 'string',
            required: true,
        },

    },
    { timestamps: true, }
);

module.exports = mongoose.model('song', songSchema)