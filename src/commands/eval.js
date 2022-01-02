
const Discord = require("discord.js");
const config = require("../configs/config.json");

exports.run = async (database, message, args) => {
    if (!["717709392119857203", "717709392119857203"].includes(message.author.id)) return message.react(config.emojis.red);
    if (!args[0]) return;
    let code = args.join(' ');
    try { 
        var evaled = temiz(await eval(code));
        if(evaled.match(new RegExp(`${database.token}`, 'g'))) evaled.replace(database.token, "Yasaklı komut");
        return message.react(config.emojis.onay) && message.channel.send(`${evaled.replace(database.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) {
        return message.react(config.emojis.red) && message.channel.send(err, {code: "js", split: true})
    };
};

exports.conf = {
    name: "eval",
    aliases: ["e"]
};

function temiz(text) {
    if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
    text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
    return text;
};
