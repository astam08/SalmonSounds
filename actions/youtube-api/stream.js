const ytdl = require("ytdl-core");

class createStream{
  Constructor(url, filter){
    this.URL = url; // setting URL Prototype to URL of video link
    this.stream =  ytdl(url, filter); // actually returning the stream
  }
  get get_stream(){
    return this.stream;
  }
  get getInfo(){
    return ytdl.getInfo(this.URL); // YouTube info but with URL
  }
}
module.exports = createStream;
