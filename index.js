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
    throw(new Error('ACCOUNT TYPE is USER not BOT'));
  }
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
			]
		}}).catch(console.error);
		return;
	}
  if (message.content.toLowerCase().startsWith(config["prefix"] + "play")||message.content.toLowerCase().startsWith(config["prefix"] + "yt")||message.content.toLowerCase().startsWith(config["prefix"] + "start")) {
    if (message.member.voiceChannel) {
			if(message.guild.members.get(client.user.id).voiceChannel){
				if(message.guild.members.get(client.user.id).voiceChannel.id == message.member.voiceChannel.id){
					message.reply(`I am already in the same voice channel that you are in. Please do ${config['prefix']}stop, ${config['prefix']}disconnect, or ${config['prefix']}leave in order to play a different song as queues have not been added in for this version of SalmonSounds.`).catch(console.error);
					return;
				}
			}
      if (message.member.voiceChannel.joinable) {
        // parsing message
        let url = new actions.parser(message.content).getParsedMessage();
				try {
          // getting YouTube info
          (new actions.yt_search.search(url).search()).then((videoURL)=>{
					let stream = new actions.yt_search.createStream(videoURL, {filter: 'audioonly'});
          stream.getInfo().then((i, f) => {
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
                  value: TimeParser.format((Number(i["length_seconds"]) * 1000)), // get length of video in seconds, multiply by 1000 to convert to milliseconds, use parser to parse into Time format. This parser took forever to make.
                  inline: true
                },
                {
                  name: "Views",
                  value: i["view_count"],
                  inline: true
                }
              ]
            }}).catch(console.error);
            message.member.voiceChannel.join().then((connection) => {
              // joining voice channel and attempting to play stream
              message.channel.send("Joining `" + message.member.voiceChannel.name + "`").catch(console.error);
              connection.playStream(stream.get_stream()).on("end", ()=> {connection.disconnect();});
            });
          });
				});
        } catch (e) {
          // something with getting youtube video and/or playing it has failed.
          message.channel.send(e.message).catch(console.error);
        }
      } else {
        // in voice channel but lacking perms
        message.reply("It seems that you are in a voice channel, but I can't join!").catch(console.error);
      }
    } else {
      // no voice channel
      message.reply("You are not in a voice channel!").catch(console.error);
    }
		return;
  }
  if (message.content.toLowerCase() == config["prefix"] + "stop" || message.content.toLowerCase() == config["prefix"] + "disconnect" || message.content.toLowerCase() == config["prefix"] + "leave") {
    // stop stream and disconnect from voice channel
  	if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
      message.channel.send("Disconnected.").catch(console.error);
      return;
  	} else {
  		message.reply("I am not in a voice channel!").catch(console.error);
    }
		return;
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
          name: 'Bot Administrators (User IDs)',
          value: config['botAdmins'].join(', ') || 'None set!',
          inline: true
        },
        {
          name: 'Eval for Administrators',
          value: config['enable-eval'],
          inline: true
        }]
    }}).catch(console.error);
		return;
  }
	// eval command
  if(message.content.toLowerCase().startsWith(config['prefix'] + 'eval') && config["enable-eval"] == true && config["botAdmins"].includes(message.author.id)){
    let evalstring = String(message.content.substring((config['prefix'] + 'eval').length));
    console.log(`EVAL RAN BY <${message.author.username}>: ${evalstring}`);
    eval(evalstring);
		return;
  }
});
// connect to Discord
client.login(config['token']);
