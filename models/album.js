const mongoose = require('mongoose');

const albumSchema = mongoose.Schema(
    {
        name: {
            type: 'string',
            required: true,
        },
        image: {
            type: 'string',
            required: false,
        },

        artist:{
            type: 'string',
            required: true,
        },
        
        language: {
            type: 'string',
            required: true,
        },
    
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('album', albumSchema)