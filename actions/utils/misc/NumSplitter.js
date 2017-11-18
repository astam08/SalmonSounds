module.exports = (e)=>{
	// i like the letter 'e' is nice
	e = Number(e);
	if(e == NaN || e == undefined) throw(new Error('Value is not a number!'));
	let _toString = '';
	for(i = 0; i < String(e).length; i++){
		_toString += String(e)[i];
		if((e % 3) == 0 && i < String(e).length){
			_toString += ',';
		}
	}
	return _toString;
};
