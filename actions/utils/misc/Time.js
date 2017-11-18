class Time{
	constructor(ms){
		this.Milliseconds = ms; // simply time in milliseconds
		this.Seconds = ms / 1000; // time in seconds
		this.Minutes = ms / 1000 / 60; // time in minutes
		this.Hours = ms / 1000 / 60 / 60; // time in hours
		this.Days = ms / 1000 / 60 / 60 / 24; // time in days
		this.Weeks = ms / 1000 / 60 / 60 / 24 / 7; // time in weeks
	}
	static format(a){
		let s;
		if (typeof(a) == 'object' && a.Milliseconds){
			// variable passed is in fact a Time object
			s = ~~(a.Milliseconds/1000);
		}else{
			// assume milliseconds
			s = ~~(a/1000);
		}
		let days = ~~(s/24/60/60); // final
		let h = ~~(s - (days * 86400));
		let hours = ~~(h/3600); // final
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
		_toString += (seconds && seconds >= 10) ? `${seconds}:` : `0${seconds}`;
		return _toString;
	}
	toString(){
		return `Milliseconds: ${this.Milliseconds}, Seconds: ${this.Seconds}, Minutes: ${this.Minutes}, Hours: ${this.Hours}, Days: ${this.Days}, Weeks: ${this.Weeks}`;
	}
}
module.exports = Time;
