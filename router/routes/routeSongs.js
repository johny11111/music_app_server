const router = require('express').Router();

const song = require('../../models/song');



router.post("/save", async (req, res) => {
    const newSong = song(
        {
            name: req.body.name,
            image: req.body.image,
            songUrl: req.body.songUrl,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
        });
    try {
        const savedSongOnDB = await newSong.save();
        return res.status(200).send({ success: true, song: savedSongOnDB });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }

});


router.get('/getOneSong/:id', async (req, res) => {
    const filter = { _id: req.params.id }
    try {
        const data = await song.findOne(filter);
        if (data) {
            return res.status(200).send({ success: true, song: data });
        }
    }
    catch (err) {
        return res.status(400).send({ success: false, msg: "song  not found" });
    }

});


router.get("/getAllSongs", async (req, res) => {
    try {
        const data = await song.find().sort({ createdAt: 1 }).lean();

        if (data) {
            return res.status(200).send({ success: true, songs: data });
        } else {
            return res.status(404).send({ success: false, msg: "No songs found" });
        }
    } catch (error) {
        return res.status(500).send({ success: false, msg: "Internal Server Error", error: error });
    }
})


router.delete("/delete/:id", async (req, res) => {
    try {
        const filter = { _id: req.params.id };

        const result = await song.deleteOne(filter);

        if (result === null) {
            return res.status(400).send({ success: false, msg: "song not found" });
        } else {
            return res.status(200).send({ success: true, msg: "song deleted successfully", data: result });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, msg: "Internal server error" });
    }
});


router.put('/update/:id', async (req, res) => {
    const filter = { _id: req.params.id };

    const options = {
        upsert: true,
        new: true,
    };

    try {
        const result = await song.findOneAndUpdate(filter, {
            name: req.body.name,
            image: req.body.image,
            songUrl: req.body.songUrl,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
        }, options);

        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
})


module.exports = router;