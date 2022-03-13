const router = require("express").Router();
const Chat = require("../../models/chat.model");

//new conv

router.post("/", async (req, res) => {
  const newChat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedChat = await newChat.save();
    res.status(200).json(savedChat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(chat)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
/*const router = require("express").Router();
const Chat = require("../../models/chat.model");
const Message = require("../../models/message.model");
const isLoggedIn = require("../../helpers/isLoggedIn");

router.route("/:users").get(isLoggedIn, async function (req, res) {
    Chat.findOne({ "users": req.params.users }, async function (err, chat) {
        if (err) console.log(err);

        if (!Chat) {
            return res.status(204).send();
        }

        res.status(200).send(chat);
    });
});

router.route("/").post(function (req, res) {

    Chat.find({users : req.body.users}, function (err, chat) {
        if (chat.length) {
            Chat.findOneAndUpdate({ users: req.body.users }, {$push: { messages: req.body.message }})
        } else {
            chat.register(new Chat({
                users: req.body.users,
                messages: new Message({

                })
            }))
        }
    });*/
    /*User.register(new User({
        username: req.body.username,
        name: req.body.name,
        status: req.body.status
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
        }
        passport.authenticate("local")(req, res, function () {
            console.log(user);
            res.status(200).send();
        });
    });
});*/