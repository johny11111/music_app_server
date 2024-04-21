const express = require('express');
const port = process.env.PORT || 4001;
const app = express();
const dotenv = require('dotenv');
dotenv.config()

const cors = require('cors', { origin: true });
const { default: db } = require('mongoose')

app.use(cors());
app.use(express.json());

const router = require("./router/router")

app.use("/", router)


db.connect(process.env.DB_CONNECT);
db.connection
    .once("open", () => console.log("connected to data base"))
    .on("error", (err) => console.log("error: ", err))

app.listen(port, () => console.log(`the server is listening on ${port}`));