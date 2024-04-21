const router = require('express').Router();

const artists = require('../../models/artist');

router.post("/save", async (req, res) => {
    const newArtist = artists(
        {
            name: req.body.name,
            image: req.body.image,
            twitter: req.body.twitter,
            instagram: req.body.instagram
        });
    try {
        const savedArtistOnDB = await newArtist.save();
        return res.status(200).send({ success: true, artist: savedArtistOnDB });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }

});


router.get('/getOneArtist/:id', async (req, res) => {
    const filter = { _id: req.params.id }
    try {
        const data = await artists.findOne(filter);
        if (data) {
            return res.status(200).send({ success: true, artist: data });
        }
    }
    catch (err) {
        return res.status(400).send({ success: false, msg: "artist not found" });
    }

});


router.get("/getAllArtists", async (req, res) => {
    try {
        const data = await artists.find().sort({ createdAt: 1 }).lean();

        if (data.length > 0) {
            return res.status(200).send({ success: true, artist: data });
        } else {
            return res.status(404).send({ success: false, msg: "No artists found" });
        }
    } catch (error) {
        return res.status(500).send({ success: false, msg: "Internal Server Error", error: error });
    }
})


router.delete("/delete/:id", async (req, res) => {
    try {
        const filter = { _id: req.params.id };

        const result = await artists.deleteOne(filter);

        if (result === null) {
            return res.status(400).send({ success: false, msg: "artist not found" });
        } else {
            return res.status(200).send({ success: true, msg: "artist deleted successfully", data: result });
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
        const result = await artists.findOneAndUpdate(filter, {
            name: req.body.name,
            image: req.body.image,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
        }, options);

        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }   
})




module.exports = router;        