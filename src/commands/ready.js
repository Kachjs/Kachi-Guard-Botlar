
const Discord = require("discord.js");
const config = require("../configs/config.json");

exports.run = (database, message, args) => {
    if (!["717709392119857203", "717709392119857203"].includes(message.author.id)) return message.react(config.emojis.red);
    message.reply(`Kachi Was Here Calm Down Baby:)`)
};

exports.conf = {
    name: "ready?",
    aliases: []
};
