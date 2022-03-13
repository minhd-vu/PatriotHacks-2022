const router = require("express").Router();
const User = require("../models/user.model");

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
    const users = await User.find({ username: new RegExp(req.body.query, "i") });

    if (!users) {
        return res.status(204).send();
    }

    res.status(200).send(users);
});

module.exports = router;