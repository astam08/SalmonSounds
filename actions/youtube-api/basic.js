const ytdl = require("ytdl-core");
const YT_Node = require('youtube-node');
const youtube = new YT_Node();
const config = require('../../config.json')['configuration'];


youtube.setKey(config['YTAPIKey']);

class createStream{
  constructor(url, filter){
    this.URL = url; // setting URL Prototype to URL of video link
    this.stream =  ytdl(url, filter); // actually returning the stream
  }
  get_stream(){
    return this.stream;
  }
  getInfo(){
    return ytdl.getInfo(this.URL); // YouTube info but with URL
  }
}

class search{
	constructor(TextForSearch){
		this.textforsearch = TextForSearch;
	}
}

module.exports = {createStream:createStream, search:search};
