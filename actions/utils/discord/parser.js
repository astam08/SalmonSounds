class Parser{
  constructor(text){
    this.original = text;
    let parser = text.split(" "); // lol this parser was made by Sean (@iComputer7) so it works but it's definitely not the most efficient..
		let parsed = [];
    for (let i = 0; i <= parser.length; i++) {
      if (i >= 1) {
        parsed.push(parser[i]);
      }
    }
    parsed = parsed.join(" ");
    parsed = parsed.substring(0, parsed.length - 1);
		this.parsedMessage = parsed;
  }
  getParsedMessage(){
    return this.parsedMessage;
  }
}
module.exports = Parser;
