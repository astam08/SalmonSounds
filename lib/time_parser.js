/*
 *  Class: time_parser.js
 *
 *  Use:
 *
 *      Parsing Time:
 *          var e = 36000; // time in milliseconds
 *          var newTime = Time.format( e );
 *
 *			Undo Parse:
 *					var e = "3:3:3";
 *					var b = Time.undo_format(e);
 *
 *      New Object
 *          var e = new Time( 36000 );
 *
 */

class Time{
	constructor( ms ){
		this.Milliseconds = ms; // time in milliseconds
		this.Seconds = ms / 1000; // time in seconds
		this.Minutes = ms / 1000 / 60; // time in minutes
		this.Hours = ms / 1000 / 60 / 60; // time in hours
		this.Days = ms / 1000 / 60 / 60 / 24; // time in days
		this.Weeks = ms / 1000 / 60 / 60 / 24 / 7; // time in weeks
	}
	static format( a ){
		let s;
		if (typeof( a ) == 'object' && a.Milliseconds){
            // assumed to be a 'Time' object
			s = ~~(a.Milliseconds/1000);
		}else{
			// assume milliseconds
			s = ~~(a/1000);
		}
		let days = ~~(s/24/60/60);
		let h = ~~(s - (days * 86400));
		let hours = ~~(h/3600);
		let m = ~~(h-(hours*3600));
		let minutes = ~~(m/60);
		let seconds = ~~(s % 60);
		let seconds_toString = (seconds < 10) ? '0' + String(seconds) : String(seconds);
		let _toString = '';
		_toString += (days && days >= 10) ? `${days}:` : '';
		_toString += (days && days < 10) ? `0${days}:` : '';
		_toString += (hours && hours >= 10) ? `${hours}:` : '';
		_toString += (hours && hours < 10) ? `0${hours}:` : '';
		_toString += (minutes && minutes >= 10) ? `${minutes}:` : `0${minutes}:`;
		_toString += (seconds && seconds >= 10) ? `${seconds}` : `0${seconds}`;
		return _toString;
	}
	static undo_format( a ){
		// assuming format HH:MM:SS
		let b = a.split( ':' );
		switch(b.length){
			case 0:
				return false;
				break;
			case 1:
				return Number( b[0] );
				break;
			case 2:
				return (Number( b[0] ) * 60) + Number( b[1] );
			break;
			case 3:
				return (Number( b[0] ) * 60 * 60) + (Number( b[1] ) * 60) + Number( b );
				break;
			default:
				return false;
				break;
		}
	}
	toString(  ){
		return `Milliseconds: ${this.Milliseconds}, Seconds: ${this.Seconds}, Minutes: ${this.Minutes}, Hours: ${this.Hours}, Days: ${this.Days}, Weeks: ${this.Weeks}`;
	}
};
module.exports = Time;
