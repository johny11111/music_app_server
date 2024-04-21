const router = require('express').Router();

const album = require('../../models/album');

router.post("/save", async (req, res) => {
    const newAlbum = album(
        {
            name: req.body.name,
            image: req.body.image,
            artist: req.body.artist,
            language: req.body.language,
        });
        
    try {
        const savedAlbumOnDB = await newAlbum.save();
        return res.status(200).send({ success: true, album: savedAlbumOnDB });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }

});


router.get('/getOneAlbum/:id', async (req, res) => {
    const filter = { _id: req.params.id }
    try {
        const data = await album.findOne(filter);
        if (data) {
            return res.status(200).send({ success: true, album: data });
        }
    }
    catch (err) {
        return res.status(400).send({ success: false, msg: "album not found" });
    }

});


router.get("/getAllALbums", async (req, res) => {
    try {
        const data = await album.find().sort({ createdAt: 1 }).lean();

        if (data.length > 0) {
            return res.status(200).send({ success: true, album: data });
        } else {
            return res.status(404).send({ success: false, msg: "No albums found" });
        }
    } catch (error) {
        return res.status(500).send({ success: false, msg: "Internal Server Error", error: error });
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        const filter = { _id: req.params.id };

        const result = await album.deleteOne(filter);

        if (result === null) {
            return res.status(400).send({ success: false, msg: "album not found" });
        } else {
            return res.status(200).send({ success: true, msg: "album deleted successfully", data: result });
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
        const result = await album.findOneAndUpdate(filter, {
            name: req.body.name,
            image: req.body.image,
            language: req.body.language,
            playlist: req?.body?.playlist
        }, options);

        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
})


router.get('AlbumName/:songName', (req, res) => {
    const songName = req.params.songName;
    const filePath = path.join(__dirname, '../public/songs', songName);

    // שליחת הקובץ של השיר
    res.sendFile(filePath);
});


module.exports = router;