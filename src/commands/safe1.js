
const Discord = require("discord.js");
const fs = require("fs");
const config = require("../configs/config.json");
const whitelist = require("../configs/whitelist1.json");

exports.run = (database, message, args) => {
    if(message.author.id !== "717709392119857203") return message.react(config.emojis.red);

    let kachiEmbed = new Discord.MessageEmbed().setFooter(config.footer, database.guilds.cache.get(config.guildID).iconURL({ dynamic: true })).setColor(0x36041c).setTimestamp();
    let kullanıcı;
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(e => e.name === args.join(" "));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (rol) kullanıcı = rol;
    if (uye) kullanıcı = uye;
    let güvenli = whitelist.güvenliliste || [];
    if (!kullanıcı) return message.channel.send(kachiEmbed.setDescription(`Güvenli listeye ekleyip çıkarmak istediğiniz kullanıcıyı belirtin. \nÖrnek: \`${config.prefix}${this.conf.name} @kachi/ID\``).addField("Aktif güvenli kişiler listesi:", güvenli.length > 0 ? güvenli.map(kachi => (message.guild.roles.cache.has(kachi.slice(1)) || message.guild.members.cache.has(kachi.slice(1))) ? (message.guild.roles.cache.get(kachi.slice(1)) || message.guild.members.cache.get(kachi.slice(1))) : kachi).join('\n') : "`Listede kimse bulunmuyor.`")).then(e => message.react(config.emojis.notr));
    if (güvenli.some(e => e.includes(kullanıcı.id))) {
        güvenli = güvenli.filter(e => !e.includes(kullanıcı.id));
        whitelist.güvenliliste = güvenli;
        fs.writeFile("./src/configs/whitelist1.json", JSON.stringify(whitelist), (err) => {
            if (err) console.log(err);
        });
        message.reply(`${kullanıcı} güvenli listeden başarıyla **kaldırıldı!**`).then(e => e.delete({ timeout: 10000 }) && message.react(config.emojis.onay));
    } else {
        whitelist.güvenliliste.push(`E${kullanıcı.id}`);
        fs.writeFile("./src/configs/whitelist1.json", JSON.stringify(whitelist), (err) => {
            if (err) console.log(err);
        });
        message.reply(`${kullanıcı} güvenli listeye başarıyla **eklendi!**`).then(e => e.delete({ timeout: 10000 }) && message.react(config.emojis.onay));
    }
};

exports.conf = {
    name: "safe1",
    aliases: ["güvenli1"]
};
