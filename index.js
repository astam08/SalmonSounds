const Discord = require("discord.js");
const client = new Discord.Client();
//gotta import that fancy config file
const config = require("./config.json")['configuration'];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  if (config['custom-game'] == "") {
    client.user.setGame(config['prefix'] + "help");
  } else {
    client.user.setGame(config['custom-game']);
  }
});

client.on("message", (message) => { //eww these indents suck but i'm too lazy to change the setting
  if (message.content == config["prefix"] + "voice") {
    if (message.member.voiceChannel) {
      message.channel.send("You are in the voice channel" + message.member.voiceChannel.name);
    }
  }
});

client.login(config['token']);
