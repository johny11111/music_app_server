const route = require('express').Router()
const admin = require("../../config/firebase.config");
const user = require('../../models/user');
const User = require("../../models/user");

 

route.get('/login', async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ massage: "Invalid Token" })
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
        const codeValue = await admin.auth().verifyIdToken(token);
        if (!codeValue) {
            return res.status(505).send({ massage: "unauthorized" })
        } else {
            const existUser = await User.findOne({ "userId": codeValue.user_id })

            if (!existUser) {
                 return newUserValue(codeValue, req, res)
                // return res.status(505).send({ message: "mail not found " })
            } else {
                return updateUserData(codeValue, req, res)
            }
        }
    } catch (err) {
        return res.status(505).send({ message: err })
    }
})

const newUserValue = async (codeValue, req, res) => {
    const newUser = new User({
        name: codeValue.name,
        email: codeValue.email,
        image: codeValue.picture,
        userId: codeValue.user_id,
        emailVerified: codeValue.email_verified,
        role: "member",
        authTime: codeValue.auth_time,
    })
    try {
        const savedUser = await newUser.save();
        res.status(200).send({ user: savedUser })
    } catch (err) {
        res.status(400).send({ success: false, msg: err })
    }
}

const updateUserData = async (codeValue, req, res) => {
    const filter = { userId: codeValue.user_id };

    const options = {
        upsert: true,
        new: true,
    };
    try {
        const result = await user.findOneAndUpdate(
            filter,
            { authTime: codeValue.auth_time },
            options,
        );
        res.status(200).send({ user: result })
    } catch (err) {
        res.status(400).send({ success: false, msg: err })
    }
}

route.get('/getAllUsers', async (req, res) => {
    try {
        const data = await user.find().sort({ createdAt: 1 });

        if (data.length > 0) {
            const leanData = data.map(doc => doc.toObject());
            return res.status(200).send({ success: true, user: leanData });
        } else {
            return res.status(404).send({ success: false, msg: "No users found" });
        }
    } catch (error) {
        return res.status(500).send({ success: false, msg: "Internal Server Error", error: error });
    }
})

route.put("/updateRole/:userId", async (req, res) => {
    const filter = { _id: req.params.userId }
    const role = req.body.data.role
    const option = {
        upsert: true,
        new: true,
    };

    try {
        const result = await user.findOneAndUpdate(filter, { role: role }, option);
        res.status(200).send({ user: result })
    } catch (error) {
        return res.status(404).send({ success: false, msg: error });
    }

})

route.delete("/delete/:id", async (req, res) => {
    try {
        const filter = { _id: req.params.id.split('=')[1] };
        console.log(filter);
        if (filter) {
            const result = await User.findOneAndDelete(filter, { _id: req.params.id});
            console.log(result);
            if (result === null) {
                return res.status(400).send({ success: false, msg: "user not found" });
            } else {
                return res.status(200).send({ success: true, msg: "user deleted successfully", data: result });
            }

        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, msg: "Internal server error" });
    }
});

route.put("/updatePlaylist/:userId", async (req, res) => {
    const filter = { _id: req.params.userId }
    const playlist = req.body.data
    
    const option = {
        upsert: true,
        new: true,
    };

    try {
        const result = await user.findOneAndUpdate(filter, { $addToSet: { playlist: playlist } }, option);
        res.status(200).send({ user: result })
    } catch (error) {
        return res.status(404).send({ success: false, msg: error });
    }
})





module.exports = route
