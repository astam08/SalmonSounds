const Discord = require("discord.js");
const client = Discord.Client();

client.on("message", (message) => { //eww these indents suck but i'm too lazy to change the setting
  if (message.content == "salmon test") {
    message.channel.send("Yeah, I work. So be it");
  }
});
