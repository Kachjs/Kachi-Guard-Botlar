
const mongoose = require("mongoose");

const rol = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    roleID: String,
    name: String,
    color: String,
    hoist: Boolean,
    position: Number,
    permissions: Number,
    mentionable: Boolean,
    time: Number,
    members: Array,
    channelOverwrites: Array
});

module.exports = mongoose.model("Roles", rol);
