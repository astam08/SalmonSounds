![alt text](https://img.shields.io/badge/Release-Alpha-red.svg)
![alt text](https://img.shields.io/badge/API-Discord.js%20v11.2.1-blue.svg)
![alt text](https://img.shields.io/badge/Stability-Stable-green.svg)
# SalmonSounds
A Discord music bot made with Discord.js.<br>
## Invite official bot!
[Click here to invite](https://discordapp.com/oauth2/authorize?client_id=355909071221817344&scope=bot&permissions=104190016)<br>
## Commands
&#8226; `!play/!yt/!start`<br>
&#8226; `!stop/!disconnect/!leave`<br>
&#8226; `!eval`<br>
## Main Contributors
&#8226; [iComputer7](https://github.com/iComputer7)<br>
&#8226; [SalmonSeasoning](https://github.com/SalmonSeasoning)<br>
## Website
[GitHub Pages](https://salmonseasoning.github.io/SalmonSounds)<br>
## Download
If you want to host SalmonSounds yourself, go right ahead! Just clone this repository or download a stable release in [Releases](https://github.com/SalmonSeasoning/SalmonSounds/releases)!<br>
## How to set up!
1) [Download](https://github.com/SalmonSeasoning/SalmonSounds/releases) and Extract Repository<br>
2) Install dependencies<br>
3) Edit config.json<br>
4) Run `node .` (optional: install [Forever](https://github.com/foreverjs/forever) and use that instead)<br>
Note: You might have to delete things such as `package.json` (for example) and start the Node project from scratch using `npm init`<br>
## Dependencies
&#8226; Discord.js -- **required** -- `npm install discord.js --save`<br>
&#8226; Discord.js-arbitrary-ffmpeg -- **required** -- `npm install discord.js-arbitrary-ffmpeg --save`<br>
&#8226; Node-Opus -- **required** -- `npm install discord.js node-opus --save`<br>
&#8226; ytdl-core -- **required** -- `npm install ytdl-core --save`<br>
&#8226; [FFMPEG](https://www.ffmpeg.org) -- **required** -- (add 'bin' folder location to PATH)<br>
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
