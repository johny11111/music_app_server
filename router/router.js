const router = require('express').Router();

const userRoute = require('../router/routes/routeAuth');

const artistRoutes = require("./routes/routeArtist")
const albumRoutes = require("./routes/routeAlbums")
const songRoutes = require("./routes/routeSongs")

router.use("/users/", userRoute)


router.use("/artists/", artistRoutes)


router.use("/albums/", albumRoutes)


router.use("/songs/", songRoutes)




module.exports = router;


