// defining global constants
const Discord = require("discord.js");
const client = new Discord.Client();
const actions = require('./actions');
const config = require("./config.json")['configuration']; // config file

client.on("ready", () => {
  // bot is online, logging status
  console.log(`Logged in as ${client.user.username}#${client.user.discriminator}.`);
  // detecting if a custom game is set, elsewise the default "game" will be set.
  if (config['custom-game'] == "") {
    client.user.setGame(config['prefix'] + "help");
  } else {
    client.user.setGame(config['custom-game']);
  }
  console.log('SalmonSounds bot is successfully up and running!');
});

client.on("disconnect", () => {
  // logging status (disconnected from Discord)
  console.log('Disconnected!');
});

client.on("reconnecting", ()=>{
  // logging status (attempting to reconnect to Discord)
  console.log('Attempting to reconnect.');
});




client.on("message", (message) => {
  if(message.author.id == client.user.id || message.author.bot) return; // if user is a bot (or more specifically, this bot), return.
  if(message.content.toLowerCase().startsWith(config['prefix'] + 'join')){ // join voice channel
    if(message.member.voiceChannel){
      if(message.member.voiceChannel.joinable){
        message.member.voiceChannel.join().then((vc)=>{
          message.reply('Joining `' + message.member.voiceChannel.name + '`'); // notifying everyone that bot is attempting to join
        });
      } else {
        message.reply("It seems that you are in a voice channel, but I can't join!"); // notifying everyone that bot was unable to join
      }
    } else {
      message.reply("You are not in a voice channel!"); // notifying everyone that there is no voice channel to join
    }
  }

  if (message.content.toLowerCase().startsWith(config["prefix"] + "play")) {
    if (message.member.voiceChannel) {
      if (message.member.voiceChannel.joinable) {
        // parsing message
        let url = actions.parser(message.content).parsedMessage;

        try {
          // getting YouTube info
          let stream = actions.yt_search.createStream(url, {filter: 'audioonly'});
          stream.get_stream().getInfo().then((i, f) => {
            // .. sending video info to discord channel
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
              // joining voice channel and attempting to play stream
              message.channel.send("Joining `" + message.member.voiceChannel.name + "`");
              connection.playStream(stream.get_stream()).on("end", ()=> {connection.disconnect();});
            });
          });
        } catch (e) {
          // something with getting youtube video and playing it failed.
          message.channel.send(e.message);
        }
      } else {
        // in voice channel but lacking perms
        message.reply("It seems that you are in a voice channel, but I can't join!");
      }
    } else {
      // no voice channel
      message.reply("You are not in a voice channel!");
    }
  }
  if(message.content.toLowerCase() == config['prefix'] + 'invite'){
    // get invite
    message.reply('join our server! ' + config['guild-invite-link']);
  }
  if (message.content.toLowerCase() == config["prefix"] + "stop" || message.content.toLowerCase() == config["prefix"] + "disconnect" || message.content.toLowerCase() == config["prefix"] + "leave") {
    // stop stream and disconnect from voice channel
  	if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
      message.channel.send("Disconnected.");
      return;
  	} else {
  		message.reply("I am not in a voice channel!");
    }
	}
  if(message.content.toLowerCase() == config['prefix'] + 'view-config'){
    // send message to Discord channel showing bot's config
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
  if(message.content.toLowerCase().startsWith(config['prefix'] + 'eval') && config["enable-eval"] == true && config["botAdmins"].includes(message.author.id)){
    let evalstring = String(message.content.substring(((config['prefix'] + 'eval').length)));
    console.log(`EVAL RAN BY <${message.author.username}>: ${evalstring}`);
    eval(evalstring);
  }
});




// connect to Discord
client.login(config['token']);
