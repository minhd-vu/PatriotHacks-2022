const router = require("express").Router();
const passport = require("passport");
const isLoggedIn = require("../../helpers/isLoggedIn");

router.route("/").get(isLoggedIn, async function (req, res) {
    res.status(200).send({
        username: req.user.username,
        wallet: req.user.wallet,
    });
});

router.route("/").post(passport.authenticate("local"), async function (req, res) {
    if (isLoggedIn) {
        console.log(req.user);

        res.status(200).send({
            username: req.user.username,
            wallet: req.user.wallet,
        });
    } else {
        res.status(204).send();
    }
});

module.exports = router;