/*
 *  Class: commands.js
 *
 *  Use:
 *
 *      Creating a Command:
 *          var commands = new Commands(  );
 *          commands.createCommand( "commandName", ()=>{}, "commandDescription" );
 *
 *		Removing a Command:
 *			//assuming object created
 *          commands.removeCommand( "commandName" );
 *
 *      Get a list of commands:
 *          commands.listCommands(  );
 *
 *      Getting description of a command:
 *          commands.getCommandDescription( "commandName" );
 *
 *      Getting command function:
 *          commands.acquireCommand( "commandName" );
 *
 *
 *      New Object
 *          var commands = new Commands(  );
 *
 */
class Commands{
    constructor(  ){
        this.commands = {};
    }
    createCommand( name, new_func, desc ){
        desc = desc || 'none';
        if(this.commands[name]){

            throw new Error( 'Command already exists!' );
            return false;

        }
        this.commands[name] = {
					run: new_func,
					description: desc
				};
    }
    removeCommand( name ){
        delete this.commands[name];
    }
    listCommands(  ){
        let _commands = [];
        for(let command in this.commands){
            _commands.push( command );
        }
        return _commands;
    }
    execCommand( name, m ){
				return (this.commands[name].run)(m);
    }
    getCommandDescription( name ){
				return this.commands[name].description;
    }
};
module.exports = Commands;
