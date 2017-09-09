const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
//gotta import that fancy config file
const config = require("./config.json")['configuration'];

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
  if (message.content.startsWith(config["prefix"] + "yt")) {
    if (message.member.voiceChannel) {
      if (message.member.voiceChannel.joinable) {
        var parser = message.content.split(" "), parsed = [];
        for (var i = 0; i <= parser.length; i++) {
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
              author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL
              },
              fields: [
                {
                  name: "Title",
                  value: i["title"],
                  inline: true
                },
                {
                  name: "Author",
                  value: i["author"]["name"],
                  inline: true
                }
              ]
            }});
            message.member.voiceChannel.join().then((connection) => {
              message.channel.send("Joining `" + message.member.voiceChannel.name + "`");
              connection.playStream(stream).on("end", ()=> {connection.disconnect();});
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

  if(message.content == config['prefix'] + 'invite'){
    message.channel.send('Here, join our server! ' + config['guild-invite-link']);
  }
  if (message.content.toLowerCase() == config["prefix"] + "stop") {
  	if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
  	} else {
  		message.reply("I am not in a voice channel!");
    }
	}

});


client.login(config['token']);
