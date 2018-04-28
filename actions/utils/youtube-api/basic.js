const ytdl = require("ytdl-core");
const YT_Node = require('youtube-node');
const youtube = new YT_Node();
const config = require('../../../config.json')['configuration'];
youtube.setKey(config['YTAPIKey']);

class createStream{
	constructor(url){
		this.url = url;
		this.stream = ytdl(url, {filter:'audioonly'});
	}
	get_stream(){
		return this.stream;
	}
	getInfo(){
		return ytdl.getInfo(this.url);
	}
}
class search{
	constructor(query){
		this.searchQuery = query;
	}
	init(){
		return new Promise((Resolve, Reject)=>{
			youtube.search(this.searchQuery, 30, (error, result)=>{
				// searching YouTube for first 30 results
				if(error) Reject(new Error('Search Error: ' + error));
				if(result && result.items && typeof result.items == 'object' || result.items instanceof Array || result.items instanceof JSON){
					let video = null;
					for(let i = 0; i < result.items.length; i++){
						if(result.items[i].id.kind == 'youtube#video'){
							video = String('https://www.youtube.com/watch?v=' + result.items[i].id.videoId);
							break;
						}
					}
					return (video != null) ? Resolve(video) : Reject(new Error('Search Error: No videos found!'));
				}else{
					Reject(new Error('Search Error: result.items does not exist!'));
				}
			});
		});
	}
}

/*

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
			youtube.search(this.textforsearch, 30, (error,result)=>{
				if(result.items.some((x)=>{return x.id.kind == 'youtube#video'}) == false) return reject(new Error('No videos found!'));
				let i = 0;
				while(i < result.items.length){
					if(result.items[i].id.kind == 'youtube#video'){
						resolve('https://www.youtube.com/watch?v=' + result.items[i].id.videoId);
						break;
					}
				}
			});
		});
	}

}
*/
module.exports = {createStream:createStream, search:search};
