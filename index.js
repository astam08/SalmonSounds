// defining global constants
const Discord = require("discord.js");
const client = new Discord.Client();
const actions = require('./actions');
const config = require("./config.json")['configuration']; // config file
const TimeParser = actions.Time;
if(!config['prefix']) config['prefix'] = "!"; // default in case not set!
if(!config['token'] || !config['YTAPIKey']){
    throw(new Error('Discord Token or YouTube API key not set!'));
}
client.on("ready", () => {
    // bot is online, logging status
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}.`);
    console.log('SalmonSounds bot is successfully up and running!');
    client.user.setStatus(config['status'] || 'online');
    client.user.setGame(config["prefix"]+"help");
    if(!client.user.bot){
    throw(new Error('ACCOUNT TYPE is USER not BOT!'));
    }
});
client.on("disconnect", () => {
    // logging status (disconnected from Discord)
    console.log('Disconnected! No longer trying to reconnect.');
});
client.on("reconnecting", ()=>{
    // logging status (attempting to reconnect to Discord)
    console.log('Disconnected! Attempting to reconnect.');
});

//Queue Storage
var userQueues = {};

client.on("message", (message) => {
    if(message.author.id == client.user.id || message.author.bot) return; // if user is a bot (or more specifically, this bot), return.
    //PING
    if(message.content.toLowerCase().startsWith(config['prefix'] + 'ping')){
        return message.reply(`${~~client.ping}ms`).catch(console.error);
    }
    //HELP
    if(message.content.toLowerCase().startsWith(config['prefix'] + 'help')){
        message.author.send({embed: {
            color: 16753920,
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL,
            },
            title: 'help',
            fields: [
                {
                    name: `${config['prefix']}help`,
                    value: 'Sends the author a list of commands.',
                    inline: true
                },
                {
                    name: `${config['prefix']}play, ${config['prefix']}yt, ${config['prefix']}start`,
                    value: 'Joins bot to a voice channel. Discards current stream. Starts a different stream from YouTube.',
                    inline: true
                },
                {
                    name: `${config['prefix']}leave, ${config['prefix']}disconnect, ${config['prefix']}stop`,
                    value: 'Forces the bot to stop whatever it is playing and leave the voice channel.',
                    inline: true
                },
                {
                    name: `${config['prefix']}eval`,
                    value: 'A raw JavaScript-input function for Bot Administrators / Developers. (Should only be accessible to permitted accounts!)',
                    inline: true
                },
                {
                    name: `${config['prefix']}ping`,
                    value: "Simply replies to you with the bot's ping to Discord.",
                    inline: true
                }
            ]
        }}).catch(console.error);
        return;
    }
    //PLAY/YT/START
    if (message.content.toLowerCase().startsWith(config["prefix"] + "play") || message.content.toLowerCase().startsWith(config["prefix"] + "yt") || message.content.toLowerCase().startsWith(config["prefix"] + "start")) {
        if (message.member.voiceChannel) {
            //Parsing Message
            url = new actions.parser(message.content).getParsedMessage();

            //Creating new Queue / Adding song to Queue
            if (userQueues[client.user.id] == undefined) {
                userQueues[client.user.id] = [];
            } else {
                if (!userQueues[client.user.id].length) {
                    return message.reply(`Song added to queue, current queue length: `+userQueues[client.user.id].length).catch(console.error);
                }
                userQueues[client.user.id][userQueues[client.user.id].length] = url;
            }

            if (message.member.voiceChannel.joinable) {
                //Play sound
                playSong(url, message);
            } else {
                // in voice channel but lacking perms
                message.reply("It seems that you are in a voice channel, but I can't join!").catch(console.error);
                userQueues[client.user.id] = [];
            }
        } else {
            // no voice channel
            message.reply("You are not in a voice channel!").catch(console.error);
        }
        return;
    }
    //STOP/DISCONNECT/LEAVE
    if (message.content.toLowerCase() == config["prefix"] + "stop" || message.content.toLowerCase() == config["prefix"] + "disconnect" || message.content.toLowerCase() == config["prefix"] + "leave") {
        // stop stream and disconnect from voice channel
        if (message.guild.voiceConnection) {
            if (message.guild.members.get(message.author.id).voiceChannelID === message.guild.members.get(client.user.id).voiceChannelID) {
                userQueues[client.user.id] = [];
                message.guild.voiceConnection.disconnect();
                message.channel.send("Disconnected.").catch(console.error);
                return;
            } else {
                if (message.guild.members.get(message.author.id).hasPermission('ADMINISTRATOR')) {
                    userQueues[client.user.id] = [];
                    message.guild.voiceConnection.disconnect();
                    message.channel.send("Disconnected.").catch(console.error);
                } else {
                    message.reply('I am not permitted to obey your command. You are not in the same voice channel as me and are not an Administrator.').catch(console.error);
                }
            }
        } else {
            message.reply("I am not in a voice channel!").catch(console.error);
        }
        return;
    }
    //CONFIG
    if (message.content.toLowerCase() == config['prefix'] + 'view-config') {
        // send message to Discord channel showing bot's config
        return message.channel.send({
            embed: {
                color: 16753920,
                author: {
                    name: client.user.username,
                    icon_url: client.user.displayAvatarURL
                },
                title: 'SalmonSounds (Configuration)',
                fields: [{
                        name: 'Status',
                        value: client.user.presence.status,
                        inline: true
                    },
                    {
                        name: 'prefix',
                        value: config['prefix'],
                        inline: true
                    },
                    {
                        name: 'Bot Administrators (User IDs)',
                        value: config['botAdmins'].join(', ') || 'None set!',
                        inline: true
                    },
                    {
                        name: 'Eval for Administrators',
                        value: config['enable-eval'],
                        inline: true
                    }
                ]
            }
        }).catch(console.error);
    }
    // eval command
    if (message.content.toLowerCase().startsWith(config['prefix'] + 'eval') && config["enable-eval"] == true && config["botAdmins"].includes(message.author.id)) {
        let evalstring = String(message.content.substring((config['prefix'] + 'eval').length));
        console.log(`${message.author.username}#${message.author.discriminator} is running the following code: ${evalstring}`);
        eval(evalstring);
        return;
    }
});
// connect to Discord
client.login(config['token']);

function playSong(url, message) {
    // getting YouTube info
    (new actions.yt_search.search(url)).init().then(videoUrl => {
        console.log(videoUrl || 'Does not exist..');
        let _stream = new actions.yt_search.createStream(videoUrl);
        _stream.getInfo().then(i=>{
            message.channel.send({
                embed: {
                    color: 16753920,
                    thumbnail: {
                        url: i["iurl"]
                    },
                    author: {
                        name: client.user.username,
                        icon_url: client.user.displayAvatarURL,
                    },
                    title: i["title"],
                    url: i["video_url"],
                    fields: [{
                            name: "Author",
                            value: i["author"]["name"],
                            inline: true
                        },
                        {
                            name: "Duration",
                            value: TimeParser.format((Number(i["length_seconds"]) * 1000)), // get length of video in seconds, multiply by 1000 to convert to milliseconds, use parser to parse into Time format. This parser took forever to make.
                            inline: true
                        },
                        {
                            name: "Views",
                            value: i["view_count"].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),
                            inline: true
                        },
                        {
                            name: "Requested By",
                            value: message.author.tag,
                            inline: true
                        }
                    ]
                }
            });
            message.member.voiceChannel.join().then((connection) => {
                // joining voice channel and attempting to play stream
                message.channel.send("Joining `" + message.member.voiceChannel.name + "`").catch(console.error);
                connection.playStream(_stream.get_stream()).on("end", () => {
                    nextSong(client.user.id);
                });
            });
        });
    });
}

function nextSong(id) {
    //If that user's queue is empty do nothing
    if (userQueues[id] == undefined || !userQueues[id].length) return connection.disconnect();
    //Remove Current Song
    userQueues[id].splice(0,1);

    //Play next song if it exists, else disconnect
    if (userQueues[id].length) {
        playSong(userQueues[id][0], message);
    } else {
        return connection.disconnect();
    }
}









/*
(new actions.yt_search.search(url).search()).then((videoURL) => {
    let stream = new actions.yt_search.createStream(videoURL, {
        filter: 'audioonly'
    });
    stream.getInfo().then((i, f) => {
        // .. sending video info to discord channel
        message.channel.send({
            embed: {
                color: 16753920,
                thumbnail: {
                    url: i["iurl"]
                },
                author: {
                    name: client.user.username,
                    icon_url: client.user.displayAvatarURL,
                },
                title: i["title"],
                url: i["video_url"],
                fields: [{
                        name: "Author",
                        value: i["author"]["name"],
                        inline: true
                    },
                    {
                        name: "Duration",
                        value: TimeParser.format((Number(i["length_seconds"]) * 1000)), // get length of video in seconds, multiply by 1000 to convert to milliseconds, use parser to parse into Time format. This parser took forever to make.
                        inline: true
                    },
                    {
                        name: "Views",
                        value: i["view_count"].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),
                        inline: true
                    },
                    {
                        name: "Requested By",
                        value: message.author.tag,
                        inline: true
                    }
                ]
            }
        }).catch(console.error);
        message.member.voiceChannel.join().then((connection) => {
            // joining voice channel and attempting to play stream
            message.channel.send("Joining `" + message.member.voiceChannel.name + "`").catch(console.error);
            connection.playStream(stream.get_stream()).on("end", () => {
                nextSong(client.user.id);
            });
        });
    }).catch(console.error);
    */
