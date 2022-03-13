/*const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("./message.model");

const ChatSchema = new Schema({
    users: { type: String, required: true },
    messages: { type: [Message], required: true },
}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat*/

const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);