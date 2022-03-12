const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    username: String,
    password: String,
    biography: String,
    name: String,
    status: {
        type: String,
        enum: ['safe', 'unsafe'],
    },
    entries: [{ type: Schema.Types.ObjectId, ref: "Entry" }],
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);