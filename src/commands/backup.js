const Discord = require("discord.js");
const config = require("../configs/config.json");
const logs = require("../configs/logs.json");
const RoleDatabase = require("../models/rol.js");
const ChannelDatabase = require("../models/kanal.js");
const mongoose = require("mongoose");
const moment = require("moment");

exports.run = async (database, message, args) => {
    moment.locale("tr")
    let kachiEmbed = new Discord.MessageEmbed().setFooter(config.footer, database.guilds.cache.get(config.guildID).iconURL({ dynamic: true })).setColor(0x36041c).setTimestamp();
    let logChannel = database.channels.cache.get(logs.database_log);
    if (!["717709392119857203", "717709392119857203"].includes(message.author.id)) return message.react(config.emojis.red);

    let argüman = args[0];
    let kategori = args[1];
    let id = args[2];

    if (!argüman) return message.channel.send(kachiEmbed.setDescription(`Lütfen gerekli argümanları doldurup tekrar deneyin. \nÖrnek: \`${config.prefix}${this.conf.name} <Create/Delete>\``)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.notr));

    if (argüman == "create" || argüman == "al" || argüman == "oluştur") {
        if (!kategori) return message.channel.send(kachiEmbed.setDescription(`Lütfen gerekli argümanları doldurup tekrar deneyin. \nÖrnek: \`${config.prefix}${this.conf.name} ${argüman} <Channel/Role>\``)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.notr));
        if (kategori == "channel" || kategori == "kanal") {
            channelBackup()
            message.reply(`**kanalların** yedeği başarıyla alındı! Son Kanal Yedeği: \`${moment(message.createdAt).format("lll")}\``).then(e => e.delete({ timeout: 15000 }) && message.react(config.emojis.onay));
            if (logChannel) logChannel.send(`${database.emojis.cache.get(config.emojis.onay)} Güvenlik amaçlı **kanalların** yedekleri ${message.author} tarafından \`${moment(message.createdAt).format("lll")}\` tarihinde alındı.`);
            console.log(`[DATABASE] Güvenlik amaçlı kanalların yedekleri ${message.author.username} (${message.author.id}) tarafından alındı.`);
        }
        if (kategori == "role" || kategori == "rol") {
            rolBackup()
            message.reply(`**rollerin** yedeği başarıyla alındı! Son Rol Yedeği: \`${moment(message.createdAt).format("lll")}\``).then(e => e.delete({ timeout: 15000 }) && message.react(config.emojis.onay));
            if (logChannel) logChannel.send(`${database.emojis.cache.get(config.emojis.onay)} Güvenlik amaçlı **rollerin** yedekleri ${message.author} tarafından \`${moment(message.createdAt).format("lll")}\` tarihinde alındı.`);
            console.log(`[DATABASE] Güvenlik amaçlı rollerin yedekleri ${message.author.username} (${message.author.id}) tarafından alındı.`);
        }
    }

    if (argüman == "delete" || argüman == "sil" || argüman == "remove") {
        if (!kategori) return message.channel.send(kachiEmbed.setDescription(`Lütfen gerekli argümanları doldurup tekrar deneyin. \nÖrnek: \`${config.prefix}${this.conf.name} ${argüman} <Channel/Role>\``)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.notr));
        if (kategori == "channel" || kategori == "kanal") {
            await ChannelDatabase.deleteMany({})
            message.reply(`**kanal** yedekleri başarıyla silindi! Şuan her hangi bir **kanal** yedeği bulunmuyor.`).then(e => e.delete({ timeout: 15000 }) && message.react(config.emojis.onay));
            if (logChannel) logChannel.send(`${database.emojis.cache.get(config.emojis.red)} **Kanalların** yedekleri ${message.author} tarafından \`${moment(message.createdAt).format("lll")}\` tarihinde silindi!`);
            console.log(`[DATABASE] Kanal yedekleri ${message.author.username} (${message.author.id}) tarafından silindi!`);
        }
        if (kategori == "role" || kategori == "rol") {
            await RoleDatabase.deleteMany({})
            message.reply(`**rol** yedekleri başarıyla silindi! Şuan her hangi bir **rol** yedeği bulunmuyor.`).then(e => e.delete({ timeout: 15000 }) && message.react(config.emojis.onay));
            if (logChannel) logChannel.send(`${database.emojis.cache.get(config.emojis.red)} **Rollerin** yedekleri ${message.author} tarafından \`${moment(message.createdAt).format("lll")}\` tarihinde silindi!`);
            console.log(`[DATABASE] Rol yedekleri ${message.author.username} (${message.author.id}) tarafından silindi!`);
        }
    }

    if (argüman == "load" || argüman == "yükle" || argüman == "kur" || argüman == "oluştur") {
        if (!kategori) return message.channel.send(kachiEmbed.setDescription(`Lütfen gerekli argümanları doldurup tekrar deneyin. \nÖrnek: \`${config.prefix}${this.conf.name} ${argüman} <Channel/Role>\``)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.notr));
        if (kategori == "channel" || kategori == "kanal") {
            if (!id || isNaN(id)) return message.channel.send(kachiEmbed.setDescription(`Lütfen gerekli argümanları doldurup tekrar deneyin. \nÖrnek: \`${config.prefix}${this.conf.name} ${argüman} ${kategori} <${kategori}ID>\``)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.notr));
            ChannelDatabase.findOne({ guildID: config.guildID, channelID: id }, async (err , channelData) => {
                if (!channelData) return message.reply(`Belirtilen **kanal** ID'sine ait veri bulunamadı. Lütfen tekrar kontrol et.`).then(e => e.delete({ timeout: 10000 }) && message.react(config.emojis.notr));
                await message.channel.send(kachiEmbed.setDescription(`\`${channelData.name}\` adlı **kanal** yedeği kullanılarak **kanal** oluşturulacak. \nOnaylıyorsanız alttaki emojiye basın.`)).then(e => {
                    e.react(config.emojis.onay);
                    const onay = (reaction, member) => reaction.emoji.id === config.emojis.onay && member.id === message.author.id;
                    const collect = e.createReactionCollector(onay, { time: 60000 });

                    collect.on("collect", async e => {
                        setTimeout(async function () {
                            //e.delete().catch(err => console.erro(`Backup mesajı silinemedi.`));

                            message.guild.channels.create(channelData.name, {type: channelData.type}).then(channel => {
                                if (channel.type === "voice") {
                                    channel.setBitrate(channelData.bitrate);
                                    channel.setUserLimit(channelData.userLimit);
                                    channel.setParent(channelData.parentID);
                                    channel.setPosition(channelData.position);
                    
                                    if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                                        for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                                            channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                                        };
                                    };

                                } else if (channel.type === "category") {
                                    if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                                        for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                                            channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                                        };
                                    };
                                } else {
                                    channel.setRateLimitPerUser(channelData.setRateLimitPerUser);
                                    channel.setTopic(channelData.topic);
                                    channel.setParent(channelData.parentID);
                                    channel.setPosition(channelData.position);
                    
                                    if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                                        for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                                            channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                                        };
                                    };
                                };
                            });

                            if (logChannel) logChannel.send(kachiEmbed.setDescription(`${message.author} (\`${message.author.id}\`) tarafından \`${channelData.name}\` (\`${channelData.channelID}\`) **kanalının** yedeği kurulmaya başlandı.`))
                        }, 500);
                    })
                })
            })
        }
        if (kategori == "role" || kategori == "rol") {
            if (!id || isNaN(id)) return message.channel.send(kachiEmbed.setDescription(`Lütfen gerekli argümanları doldurup tekrar deneyin. \nÖrnek: \`${config.prefix}${this.conf.name} ${argüman} ${kategori} <${kategori}ID>\``)).then(e => e.delete({ timeout: 20000 }) && message.react(config.emojis.notr));
            RoleDatabase.findOne({ guildID: config.guildID, roleID: id }, async (err , roleData) => {
                if (!roleData) return message.reply(`Belirtilen rol ID'sine ait veri bulunamadı. Lütfen tekrar kontrol et.`).then(e => e.delete({ timeout: 10000 }) && message.react(config.emojis.notr));
                await message.channel.send(kachiEmbed.setDescription(`\`${roleData.name}\` adlı rolün yedeği kullanılarak rol oluşturulup, üyelere dağıtılacaktır. \nOnaylıyorsanız alttaki emojiye basın.`)).then(e => {
                    e.react(config.emojis.onay);
                    const onay = (reaction, member) => reaction.emoji.id === config.emojis.onay && member.id === message.author.id;
                    const collect = e.createReactionCollector(onay, { time: 60000 });
    
                    collect.on("collect", async e => {
                        setTimeout(async function () {
                            //e.delete().catch(err => console.error(`Backup mesajı silinemedi.`));
    
                            let yeniRol = await message.guild.roles.create({
                                data: {
                                    name: roleData.name,
                                    color: roleData.color,
                                    hoist: roleData.hoist,
                                    permissions: roleData.permissions,
                                    position: roleData.position,
                                    mentionable: roleData.mentionable
                                }, reason: `${message.author.username} tarafından yeniden açılıp dağıtılıyor.`
                            });

                            let bostaolanlar = global.tokenler.filter(e => !e.idle)
                            if (!bostaolanlar.length) bostaolanlar = bostaolanlar.sort((a,b) => a.uj - b.uj)
                            if (roleData.members.length < bostaolanlar.length) return;
                            const memberPerBot = Math.floor(roleData.members.length / bostaolanlar.length)
                            for (var i = 0; i < bostaolanlar.length; i++) {
                                const guild = bostaolanlar[i].guilds.cache.get(config.guildID)
                                if (yeniRol.deleted) break;
                                processBot(bostaolanlar[i], true, roleData.members.length)

                                let verilecekrol;
                                if (i == bostaolanlar-1) verilecekrol = roleData.members.slice(i * memberPerBot) 
                                else verilecekrol = roleData.members.slice(i * memberPerBot, (i + 1) * memberPerBot)

                                verilecekrol.forEach(async r => {
                                    if (yeniRol.deleted) return processBot(r, false, -roleData.members.length)
                                    const member = guild.members.cache.get(r);
                                    if (!member || member.roles.cache.has(yeniRol.id)) return;
                                    await member.roles.add(yeniRol.id);
                                });

                                processBot(bostaolanlar[i], false, -roleData.members.length)
                            };

                            setTimeout(() => {
                                let kanalPermler = roleData.channelOverwrites;
                                if (kanalPermler) kanalPermler.forEach((perm, index) => {
                                    let kanal = message.guild.channels.cache.get(perm.id);
                                    if (!kanal) return;
                                    setTimeout(() => {
                                        let yeniKanalPermler = {};
                                        perm.allow.forEach(e => {
                                            yeniKanalPermler[e] = true;
                                        });
                                        perm.deny.forEach(e => {
                                            yeniKanalPermler[e] = false;
                                        });
                                        kanal.createOverwrite(yeniRol, yeniKanalPermler).catch(console.error);
                                    }, index*5000);
                                })
                            }, 5000);

                            if (logChannel) logChannel.send(kachiEmbed.setDescription(`${message.author} (\`${message.author.id}\`) tarafından \`${roleData.name}\` (\`${roleData.rolID}\`) **rolünün** yedeği kurulmaya başlandı. \nRol izinleri ayarlanıp bütün üyelere dağıtılacaktır.`))
                        }, 500);
                    })
                })
            })
        }
    }

    function processBot(bot, busy, job, equal = false){
        bot.idle = busy;
        if(equal) bot.uj = job;
        else bot.uj += job;
    
        let index = global.tokenler.findIndex(e => e.user.id == bot.user.id);
        global.tokenler[index] = bot;
    }

    function rolBackup() {
        let guild = database.guilds.cache.get(config.guildID);
        if (guild) {
            guild.roles.cache.filter(e => e.name !== "@everyone" && !e.managed).forEach(rol => {
                let roleChannelOverwrites = [];
                guild.channels.cache.filter(e => e.permissionOverwrites.has(rol.id)).forEach(e => {
                    let kanalPerm = e.permissionOverwrites.get(rol.id);
                    let pushla = { id: e.id, allow: kanalPerm.allow.toArray(), deny: kanalPerm.deny.toArray() };
                    roleChannelOverwrites.push(pushla);
                });
    
                RoleDatabase.findOne({ guildID: config.guildID, rolID: rol.id }, async (err, rolKayit) => {
                    if (!rolKayit) {
                        let newRolSchema = new RoleDatabase({
                            _id: new mongoose.Types.ObjectId(),
                            guildID: config.guildID,
                            roleID: rol.id,
                            name: rol.name,
                            color: rol.hexColor,
                            hoist: rol.hoist,
                            position: rol.position,
                            permissions: rol.permissions,
                            mentionable: rol.mentionable,
                            time: Date.now(),
                            members: rol.members.map(m => m.id),
                            channelOverwrites: roleChannelOverwrites
                        });
                        newRolSchema.save();
                    } else {
                        rolKayit.name = rol.name;
                        rolKayit.color = rol.hexColor;
                        rolKayit.hoist = rol.hoist;
                        rolKayit.position = rol.position;
                        rolKayit.permissions = rol.permissions;
                        rolKayit.mentionable = rol.mentionable;
                        rolKayit.time = Date.now();
                        rolKayit.members = rol.members.map(m => m.id);
                        rolKayit.channelOverwrites = roleChannelOverwrites;
                        rolKayit.save();
                    };
                });
            });
    
            RoleDatabase.find({ guildID: config.guildID }).sort().exec((err, rol) => {
                rol.filter(e => !guild.roles.cache.has(e.roleID) && Date.now()-e.time > 1000*60*60*24*3).forEach(r => {
                    RoleDatabase.findOneAndDelete({roleID: r.roleID});
                });
            });
        };
    };

    function channelBackup() {
        let guild = database.guilds.cache.get(config.guildID);
        if (guild) {
            guild.channels.cache.filter(kanal => kanal.deleted !== true).forEach(channel => {
                let permissionss = {};
                let sayi = Number(0);
                channel.permissionOverwrites.forEach((perm) => {
                    let thisPermOverwrites = {};
                    perm.allow.toArray().forEach(p => {
                        thisPermOverwrites[p] = true;
                    });
                    perm.deny.toArray().forEach(p => {
                        thisPermOverwrites[p] = false;
                    });
                    permissionss[sayi] = {permission: perm.id == null ? guild.id : perm.id, thisPermOverwrites};
                    sayi++;
                });

                ChannelDatabase.findOne({guildID: config.guildID, channelID: channel.id}, async (err, savedChannel) => {
                    if (!savedChannel) {
                        if(channel.type === "voice"){
                            let newChannelSchema = new ChannelDatabase({
                                _id: new mongoose.Types.ObjectId(),
                                guildID: config.guildID,
                                channelID: channel.id,
                                name: channel.name,
                                parentID: channel.parentID,
                                position: channel.position,
                                time: Date.now(),
                                type: channel.type,
                                permissionOverwrites: permissionss,
                                userLimit: channel.userLimit,
                                bitrate: channel.bitrate
                            });
                            newChannelSchema.save();
                        } else if (channel.type === "category") {
                            let newChannelSchema = new ChannelDatabase({
                                _id: new mongoose.Types.ObjectId(),
                                guildID: config.guildID,
                                channelID: channel.id,
                                name: channel.name,
                                position: channel.position,
                                time: Date.now(),
                                type: channel.type,
                                permissionOverwrites: permissionss,
                            });
                            newChannelSchema.save();
                        } else {
                            let newChannelSchema = new ChannelDatabase({
                                _id: new mongoose.Types.ObjectId(),
                                guildID: config.guildID,
                                channelID: channel.id,
                                name: channel.name,
                                parentID: channel.parentID,
                                position: channel.position,
                                time: Date.now(),
                                nsfw: channel.nsfw,
                                rateLimitPerUser: channel.rateLimitPerUser,
                                type: channel.type,
                                topic: channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!",
                                permissionOverwrites: permissionss,
                            });
                            newChannelSchema.save();
                        }
                    } else {
                        if(channel.type === "voice"){
                        savedChannel.name = channel.name;
                        savedChannel.parentID = channel.parentID;
                        savedChannel.position = channel.position;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.userLimit = channel.userLimit;
                        savedChannel.bitrate = channel.bitrate;
                        savedChannel.save();
                        }else if(channel.type === "category"){
                        savedChannel.name = channel.name;
                        savedChannel.position = channel.position;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.save();
                        }else {
                        savedChannel.name = channel.name;
                        savedChannel.parentID = channel.parentID;
                        savedChannel.position = channel.position;
                        savedChannel.nsfw = channel.nsfw;
                        savedChannel.rateLimitPerUser = channel.rateLimitPerUser;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.topic = channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!";
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.save();
                        }
                    };
                });
            });

            ChannelDatabase.find({guildID: config.guildID}).sort().exec((err, channels) => {
                channels.filter(r => !guild.channels.cache.has(r.channelID) && Date.now()-r.time > 1000*60*60*24*3).forEach(r => {
                    ChannelDatabase.findOneAndDelete({channelID: r.channelID});
                });
            });
        };
    };
};

exports.conf = {
    name: "backup",
    aliases: ["yedek"]
};
