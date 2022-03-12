const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/user.model");

router.route("/").post(function (req, res) {
    User.register(new User({
        username: req.body.username,
        name: req.body.name,
        status: req.body.status,
        biography: req.body.biography,
        wallet: req.body.wallet,
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
        }
        passport.authenticate("local")(req, res, function () {
            console.log(user);
            res.status(200).send();
        });
    });
});

module.exports = router;