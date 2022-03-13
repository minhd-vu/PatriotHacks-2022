const router = require("express").Router();
const User = require("../models/user.model");
const isLoggedIn = require("../helpers/isLoggedIn");

router.route("/:id").get(async function (req, res) {
    User.findOne({ username: req.params.id }, async function (err, user) {
        if (err) console.log(err);

        if (!user) {
            return res.status(204).send();
        }

        await user.execPopulate("entries");

        res.status(200).send(user);

    });
});

router.route("/search").post(async function (req, res) {
    const users = await User.find({ name: new RegExp(req.body.query, "i") });

    if (!users) {
        return res.status(204).send();
    }

    res.status(200).send(users);

});

router.route("/").post(isLoggedIn, async function (req, res) {
    console.log(req.user);
    req.user.wallet = req.body.wallet;
    req.user.biography = req.body.biography;
    req.user.status = req.body.status;
    await req.user.save();
    res.status(200).send(req.user);
});

module.exports = router;