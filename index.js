const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
//gotta import that fancy config file
const config = require("./config.json")['configuration'];

const guildQueue = {};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  if (config['custom-game'] == "") {
    client.user.setGame(config['prefix'] + "help");
  } else {
    client.user.setGame(config['custom-game']);
  }
  console.log('SalmonSounds bot is successfully up and running!');
});
client.on("disconnect", () => {
  console.log('Disconnected!');
});
client.on("reconnecting", ()=>{
  console.log('Attempting to reconnect.');
});

client.on("message", (message) => { //eww these indents suck but i'm too lazy to change the setting
  if(message.author.id == client.user.id || message.author.bot) return;
  if(message.content.toLowerCase().startsWith(config['prefix'] + 'join')){
    if(message.member.voiceChannel){
      if(message.member.voiceChannel.joinable){
        message.member.voiceChannel.join().then((vc)=>{
          message.reply('Joining `' + message.member.voiceChannel.name + '`');
        });
      } else {
        message.reply("It seems that you are in a voice channel, but I can't join!");
      }
    } else {
      message.reply("You are not in a voice channel!");
    }
  }

  if (message.content.toLowerCase().startsWith(config["prefix"] + "play")) {
    if(guildQueue[message.guild.id]){
      var parser = message.content.split(" "), parsed = [];
      for (let i = 0; i <= parser.length; i++) {
        if (i >= 1) {
          parsed.push(parser[i]);		//Horrible parser because javascript sucks
        }
      }
      parsed = parsed.join(" ");
      parsed = parsed.substring(0, parsed.length - 1);
      guildQueue.push(parsed);
      message.channel.send({embed: {
        color: 16753920,
        thumbnail: {
          url: i["iurl"]
        },
        author: {
          name: client.user.username,
          icon_url: client.user.displayAvatarURL,
        },
        title: "ADDED TO QUEUE: " + i["title"],
        url: i["video_url"],
        fields: [
          {
            name: "Author",
            value: i["author"]["name"],
            inline: true
          },
          {
            name: "Length (seconds)",
            value: i["length_seconds"],
            inline: true
          },
          {
            name: "Views",
            value: i["view_count"],
            inline: true
          }
        ]
      }});
    } else {
      if (message.member.voiceChannel) {
        if (message.member.voiceChannel.joinable) {
          var parser = message.content.split(" "), parsed = [];
          for (let i = 0; i <= parser.length; i++) {
            if (i >= 1) {
            	parsed.push(parser[i]);		//Horrible parser because javascript sucks
            }
          }
          parsed = parsed.join(" ");
          parsed = parsed.substring(0, parsed.length - 1);

          //Parser debug
          //message.channel.send(parsed);
          try {
            var stream = ytdl(parsed, {filter: "audioonly"});
            ytdl.getInfo(parsed).then((i, f) => {
              message.channel.send({embed: {
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
                fields: [
                  {
                    name: "Author",
                    value: i["author"]["name"],
                    inline: true
                  },
                  {
                    name: "Length (seconds)",
                    value: i["length_seconds"],
                    inline: true
                  },
                  {
                    name: "Views",
                    value: i["view_count"],
                    inline: true
                  }
                ]
              }});
              message.member.voiceChannel.join().then((connection) => {
                message.channel.send("Joining `" + message.member.voiceChannel.name + "`");
                function tryMusic(stream_obj){
                connection.playStream(stream_obj).on("end", ()=> {
                  function isEmpty(obj) {
                    for(var prop in obj) {
                        if(obj.hasOwnProperty(prop))
                            return false;
                    }

                    return true;
                  }
                  if(isEmpty(guildQueue)){
                    connection.disconnect();
                  }else{
                    tryMusic(guildQueue[message.guild.id][0]);
                    guildQueue[message.guild.id].shift();
                  }
                });
              }
              tryMusic(stream);
              });
            });
          } catch (e) {
            message.channel.send(e.message);
          }
        } else {
          message.reply("It seems that you are in a voice channel, but I can't join!");
        }
      } else {
        message.reply("You are not in a voice channel!");
      }
    }
  }
  if(message.content.toLowerCase() == config['prefix'] + 'clear'){
      guildQueue[message.guild.id] = [];
      message.channel.send('Guild Queue Cleared!!');
  }
  if(message.content.toLowerCase() == config['prefix'] + 'invite'){
    message.reply('join our server! ' + config['guild-invite-link']);
  }
  if (message.content.toLowerCase() == config["prefix"] + "stop" || message.content.toLowerCase() == config["prefix"] + "disconnect" || message.content.toLowerCase() == config["prefix"] + "leave") {
  	if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
      message.channel.send("Disconnected.");
      return;
  	} else {
  		message.reply("I am not in a voice channel!");
    }
	}
  if(message.content.toLowerCase() == config['prefix'] + 'view-config'){
    message.channel.send({embed: {
      color: 16753920,
      author: {
        name: client.user.username,
        icon_url: client.user.displayAvatarURL
      },
      fields: [
        {
          name: "Token",
          value: "**SECRET**",
          inline: true
        },
        {
          name: "Blacklisted Sites",
          value: (function(){
            if(config['blacklisted-sites'] == ''){
              return 'None set';
            }else{
              return config['blacklisted-sites'].join(', ');
            }
          })(),
          inline: true
        },
        {
          name: "Custom Game Text",
          value: (function(){
            if (config['custom-game'] == "") {
              return "Not set";
            } else {
              return config['custom-game'];
            }
          })(),
          inline: true
        },
        {
          name:'Status',
          value: client.user.presence.status,
          inline: true
        },
        {
          name: 'prefix',
          value: config['prefix'],
          inline: true
        },
        {
          name: 'Discord Server Invite Link',
          value: (function(){
            if (config['guild-invite-link'] == "") {
              return "Not set";
            } else {
              return config['guild-invite-link'];
            }
          })(),
          inline: true
        },
        {
          name: 'Bot Administrators (User IDs)',
          value: (function(){
            if(config['botAdmins'] == ''){
              return 'None set';
            }else{
              return config['botAdmins'].join(', ');
            }
          })(),
          inline: true
        },
        {
          name: 'Eval for Administrators',
          value: config['enable-eval'],
          inline: true
        }]

    }});
  }
  if(message.content.toLowerCase() == config['prefix'] + 'eval' && config["enable-eval"] == true && config["botAdmins"].includes(message.author.id)){
    let evalstring = String(message.content.substring(((config['prefix'] + 'eval').length)));
    console.log(`EVAL RAN BY <${message.author.username}>: ${evalstring}`);
    eval(evalstring);
  }
});


client.login(config['token']);
