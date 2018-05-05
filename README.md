![Release:Alpha](https://img.shields.io/badge/Release-Alpha-red.svg)
![API:Discord.js v11.2.1](https://img.shields.io/badge/API-Discord.js%20v11.2.1-blue.svg)
![Stability:Stable](https://img.shields.io/badge/Stability-Stable-green.svg)
# SalmonSounds
A Discord music bot made with Discord.js.<br>
## Invite official bot!
[Click here to invite](https://discordapp.com/oauth2/authorize?client_id=355909071221817344&scope=bot&permissions=104190016)<br>
## Commands
&#8226; `!help`<br>
&#8226; `!ping`<br>
&#8226; `!play/!yt/!start`<br>
&#8226; `!stop/!disconnect/!leave`<br>
&#8226; `!eval`<br>
## Main Contributors
&#8226; [iComputer7](https://github.com/iComputer7)<br>
&#8226; [SalmonSeasoning](https://github.com/SalmonSeasoning)<br>
Note: It's quite difficult developing and testing a "host yourself" Discord music bot without many Contributors. It's even more difficult trying to make it worthwhile considering a lot of essential commands are challenging and time consuming to develop and implement.
## Website
[GitHub Pages](https://salmonseasoning.github.io/SalmonSounds)<br>
## Download
If you want to host SalmonSounds yourself, go right ahead! Just clone this repository or download a stable release in [Releases](https://github.com/SalmonSeasoning/SalmonSounds/releases)!<br>
# Report Issues
If you are experiencing issues with SalmonSounds, please report them here: [Issues](https://github.com/SalmonSeasoning/SalmonSounds/issues)!
## Normal set up
1) [Download](https://github.com/SalmonSeasoning/SalmonSounds/releases) and Extract Repository<br>
2) Install dependencies<br>
3) Edit config.json<br>
4) Run `node .` (optional: install [Forever](https://github.com/foreverjs/forever) and use `forever start index.js` instead)<br>
Note: You might have to delete things such as `package.json` (for example) and start the Node project from scratch using `npm init`<br>

## Docker set up
1) Install Docker `apt install docker.io`
2) Clone repository `git clone https://github.com/SalmonSeasoning/SalmonSounds.git`
3) CD into directory `cd SalmonSounds`
4) Build the container `docker build -t salmonsounds .` Be patient! This may take 5-20 minutes to compile!
5) Run the container `docker run -d salmonsounds`
## Required Dependencies
&#8226; Discord.js `npm install discord.js --save`<br>
&#8226; Discord.js-arbitrary-ffmpeg `npm install discord.js-arbitrary-ffmpeg --save`<br>
&#8226; Node-Opus `npm install node-opus --save`<br>
&#8226; ytdl-core `npm install ytdl-core --save`<br>
&#8226; [FFMPEG](https://www.ffmpeg.org) (add 'bin' folder location to PATH)<br>
&#8226; youtube-node `npm install youtube-node --save`<br>

## Optional Dependencies
&#8226; Sodium `npm install sodium --save` and `npm install libsodium-wrappers --save`<br>
&#8226; UWS `npm install uws --save`<br>
&#8226; erlpack `npm install hammerandchisel/erlpack --save`<br>

## Config.json
```json
{
  "configuration":{
    "token":"",
    "YTAPIKey":"",
    "status":"online",
    "prefix":"!",
    "botAdmins":[],
    "enable-eval": true
  }
}
```
`token` is your Bot token. You create your bot at [Discord Developers](https://discordapp.com/developers) -- **required** --<br>
`YTAPIKey` is your YouTube API key. [Get it here!](https://console.developers.google.com/apis) -- **required** --<br>
`status` is the status you want to be displayed. It can be `online`, `idle`, `dnd` or `invisible`<br>
`prefix` is the prefix you want your bot to use (default: `!`) -- **required** --<br>
`botAdmins` is an array which should contain user ID's. It gives access to the `!eval` command<br>
`enable-eval` should be either `true` or `false` it gives bot admins access to the eval command
