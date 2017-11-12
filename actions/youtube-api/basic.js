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
	search(){
		return new Promise((resolve, reject)=>{
			youtube.search(this.textforsearch, 10, (error,result)=>{
				if(error) return reject(new Error(error.message));
				let i = 0;
				while(i < result.items.length){
					if(result.items[i].id.kind == 'youtube#video'){
						resolve('https://www.youtube.com/watch?v=' + result.items[i].id.videoId);
						break;
					}else{
						i++;
					}
					if(!i<result.items.length){
						reject(new Error('No videos found.'));
						break;
					}
				}
			});
		});
	}

}

module.exports = {createStream:createStream, search:search};
