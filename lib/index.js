const Discord   = require( 'discord.js' );
const fs        = require( 'fs' );
const Config    = JSON.parse( fs.readFileSync( './config.json', 'utf-8' ) ) || {};
const client    = new Discord.Client(  );
const Commands  = require( './commands.js' );
const TimeObj   = require( './time_parser.js' );
const ParseTime = ( time ) => TimeObj.format;
const Queues    = require('./queue.js');

// check to make sure config is correctly set up
if(!Config['Prefix']){

    console.warn( 'Prefix not set in Config! Resorting to default prefix: "!".' );

}else if(!Config['Token']){

    throw new Error( 'Discord Bot API Token has not been provided in Config! Cannot continue.' );
    process.exit(   );

}else if(!Config['YouTubeAPI3Key']){

    throw new Error( 'YouTube API 3 Key was not provided in Config! Cannot continue.' );
    process.exit(   );

}else if(!Config['Admins'][0]){

    console.warn( 'No bot admins were provided! If something goes wrong with the bot, it must be handled in the console!' );

}

client.on( 'ready', (  )=>{
    client.user.setStatus( 'online' );
    client.user.setActivity( `${Config['Prefix']}help` );
    console.log( `Successfully signed in as @${client.user.username}#${client.user.discriminator}!` );
    if(!client.user.bot){

        throw new Error( 'Account is not configured to be considered a bot by Discord!' );
        client.destroy(  );
        process.exit(  );

    }
} );

client.on( 'disconnect', (  )=>{
    throw new Error( 'Disconnected from Discord servers! Will no longer try to reconnect.' );
    client.destroy(  );
    process.exit(  );
} );

client.on( 'reconnecting', (  )=>{
    console.warn( 'Disconnected. Attempting to reconnect to Discord servers!' );
} );

function purifyMsg( message ){
    var args = message.content.split(' ');
    args.shift();
    return args.join(' ');
}

function checkMsg( message, name ){
    if(message.content.toLowerCase(  ).startsWith( Config['Prefix'].toLowerCase(  ) + name.toLowerCase(  ) )){

        return true;

    }else{

        return false;

    }
}

function checkPrefix( message ){
    if(message.content.toLowerCase(  ).startsWith( Config['Prefix'] )) return true;
    return false;
}

var commands = new Commands(  );

const defaultEmbed = {embed: {
        color: 16753920,
        author: {
         name: ()=>{return (client.user.username||null)},
         icon_url: ()=>{return (client.user.displayAvatarURL||null)},
        },
        title: 'title',
        fields: []
    }
};

commands.createCommand( 'ping', ( message )=>{
    message.reply( `${~~client.ping}ms` ).catch( console.error );
}, 'Simple ping test.' );

commands.createCommand( 'help', ( message )=>{
    var newEmbed = defaultEmbed;
    newEmbed.embed.title = 'HELP';
		newEmbed.embed.description = 'SIMPLE LIST OF ALL COMMANDS';
    for(let command in commands.listCommands(   )){
        newEmbed.embed.fields.push( {name: Config['Prefix'] + commands.listCommands(   )[command], value: commands.getCommandDescription( commands.listCommands(   )[command] ), inline:false} );
    }
    message.channel.send( message.author.tag, newEmbed ).catch( console.error );
}, 'List all commands.' );

commands.createCommand( 'eval', ( message )=>{
    if(Config['Admins'].includes( message.author.id )){

        let text = purifyMsg( message.content );
        try{
            eval( text );
        }catch(exception){
            console.error( exception.message );
        }finally{
            console.info( `Eval command issued by @${client.username}#${client.discriminator} at ${new Date()}.`);
            console.info( `Command issued was: ${text}` );
        }

    }else{

        message.reply( 'Sorry, you do not have permission to use this command!' ).catch( console.error );

    }
}, 'A simple, instantaneous code injection command for the admins.' );

commands.createCommand( 'play', ( message )=>{
    // ...
}, 'Play a song!' );

commands.createCommand( 'pause', ( message )=>{
    // ...
}, 'Pauses a song.' );

commands.createCommand( 'search', ( message )=>{
    // ...
}, 'Searches for a video.' );

commands.createCommand( 'skip', ( message )=>{
    // ...
}, 'Skip a song.' );

commands.createCommand( 'queue', ( message )=>{
    // ...
}, 'Views the queue.' );

commands.createCommand( 'clear', ( message )=>{
		// ...
}, 'Clears the queue.' );

commands.createCommand( 'rfq', ( message )=>{
		// ...
}, 'Remove from Queue' );

commands.createCommand( 'tsmp', ( message )=>{
    // ...
}, 'Toggles the Server Management Permissions only rule.' );

commands.createCommand( 'block', ( message )=>{
    // ...
}, 'Blocks a user / channel / role from using the bot. Only accessible to guild admins.' );

commands.createCommand( 'unblock', ( message )=>{
    // ...
}, 'Unblocks a user / channel / role from using the bot. Only accessible to guild admins.' );

commands.createCommand( 'seek', ( message )=>{
    // ...
}, 'Seek into the video. Start at a different time.' );

commands.createCommand( 'loop', ( message )=>{
    // can set 'loop queue' to loop through the queue,
    // 'loop current / (video/song) [index]' to loop through the song, or
    // 'loop disable' (only accessible to Server Management perms) to disable looping as a whole
}, 'Looping through videos or the entire queue.' );

commands.createCommand( 'makeadmin', ( message )=>{
    // Accepts ID's, @mentions, or @USERNAME#DISCRIMINATOR if the account exists
}, 'Make a user a bot administrator. Only accessible to bot administrators.' );

commands.createCommand( 'ban-song', ( message )=>{
    // will go into server queue's ban list
}, 'Bans a specific video from playing. Only accessible to users with Server Management.' );

commands.createCommand( 'pardon-song', ( message )=>{
    // ...
}, 'Unbans a song from playing. Only accessible to users with Server Management.' );

commands.createCommand( 'np', ( message )=>{
    // ...
}, 'View stats about current song.' );

commands.createCommand( 'linkme', ( message )=>{
    // ...
}, 'Sends link to current song to DM.' );

commands.createCommand( 'kill-bot', ( message )=>{
    // ...
}, 'Self-Explanatory. Nice try, but this too is only available to bot administrators.' );

client.on( 'message', ( message )=>{

    if(message.author.id == client.user.id || message.author.bot) return;
    let commandcall = checkPrefix( message ) ? message.content.toLowerCase().split( ' ' )[0].substring( Config['Prefix'].length ) : null;
    if(commandcall == null) return;
    for(let i = 0; i < commands.listCommands(  ).length; ++i){
			let _command = commands.listCommands(   )[i];
        if(_command == commandcall){
					commands.execCommand( _command, message );
					break;
        }
    }

} );

client.login( Config['Token'] );
