# SalmonSounds
A Discord music bot made with Discord.js.<br>
## Invite official bot!
[Click here to invite](https://discordapp.com/oauth2/authorize?client_id=355909071221817344&scope=bot&permissions=104190016)<br>
## Commands
&#8226; `!yt`<br>
&#8226; `!invite`<br>
&#8226; `!eval`<br>
## Main Contributors
&#8226; iComputer7<br>
&#8226; SalmonSeasoning<br>
## Website
[GitHub Pages](https://salmonseasoning.github.io/SalmonSounds)<br>
## Download
If you want to host SalmonSounds yourself, go right ahead! Just clone this repository or download a stable release in [Releases](https://github.com/SalmonSeasoning/SalmonSounds/releases)!<br>
## How to set up!
1) Extract repository<br>
2) Install dependencies (also delete `Node_Modules` and `npm-debug.log` to ensure this will work for your system)<br>
3) Edit config.json<br>
4) Run `node .` (optional: install [Forever](https://github.com/foreverjs/forever) and use that instead)<br>
## Dependencies
&#8226; Discord.js `npm install discord.js --save`<br>
&#8226; Node-Opus `npm install discord.js node-opus --save`<br>
&#8226; Sodium `npm install sodium --save` and `npm install libsodium-wrappers --save`<br>
&#8226; UWS `npm install uws --save`<br>
&#8226; erlpack `npm install hammerandchisel/erlpack --save`<br>
## Config.json
```
{
  "configuration":{
    "token":"",
    "blacklisted-sites":[""],
    "custom-game":"",
    "status":"online",
    "prefix":"!",
    "guild-invite-link":"https://discord.gg/245jNW8",
    "botAdmins":[]
  }
}
```
`token` is your Bot token. You create your bot at [Discord Developers](https://discordapp.com/developers)<br>
`blacklisted-sites` is the domains that you want to keep users from playing music or audio from.<br>
`custom-game` is the game you want your bot to be playing. (default: "!help")<br>
`status` is the status you want to be displayed. It can be `online`, `idle`, `dnd` or `invisible`.<br>
`prefix` is the prefix you want your bot to use. (default: `!`)<br>
`guild-invite-link` is the invite link to your Discord server. Have fun!<br>
`botAdmins` is an array which should contain user ID's. It gives access to the `eval` command and more.
`enable-eval` should be either "true" or "false" it gives bot admins access to the eval command.
