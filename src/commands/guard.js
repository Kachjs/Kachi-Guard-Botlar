
const Discord = require("discord.js");
const fs = require("fs");
const config = require("../configs/config.json");
const guards = require("../configs/guards.json");

exports.run = (database, message, args) => {
    let kachiEmbed = new Discord.MessageEmbed().setFooter(config.footer, message.guild.iconURL({ dynamic: true })).setColor(0x36041c).setTimestamp();
    if (!["717709392119857203", "717709392119857203"].includes(message.author.id)) return message.react(config.emojis.red);

    let korumalar = Object.keys(guards).filter(k => k.includes("Guard"));
    if (!args[0] || !korumalar.some(k => k.includes(args[0]))) return message.react(config.emojis.onay) && message.channel.send(kachiEmbed.setDescription(`**Bulunan Korumalar:** ${korumalar.map(k => `\`${k}\``).join(', ')} \n**Aktif Korumalar:** ${korumalar.filter(k => guards[k]).map(k => `\`${k}\``).join(', ')}`)).then(e => e.delete({ timeout: 15000 }));
    let koruma = korumalar.find(k => k.includes(args[0]));
    guards[koruma] = !guards[koruma];
    fs.writeFile("../configs/guards.json", JSON.stringify(guards), (err) => {
        if (err) console.log(err);
    });

    message.channel.send(kachiEmbed.setDescription(`**${koruma}** koruması, ${message.author} tarafından ${guards[koruma] ? `**aktif** edildi` : `**devre dışı** bırakıldı`}.`)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.onay))
};

exports.conf = {
    name: "guard",
    aliases: ["koruma"]
};
