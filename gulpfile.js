process.env.DISABLE_NOTIFIER = true;

var elixir 				= require('laravel-elixir'),
		flex         	= require('postcss-flexibility'),
		autoprefixer 	= require('autoprefixer'),
		postStylus   	= require('poststylus'),
		mqpacker     	= require('css-mqpacker');

require('laravel-elixir-stylus');

elixir(function(mix) {

	var config = [
		mqpacker(),
		autoprefixer()
	];

	// stylus
	mix.stylus('./styles/echatbot.styl', 'dist/css/echatbot.min.css', {
		use: [postStylus(config)]
	});

	mix.scripts('./echatbot.js', 'dist/js/echatbot.min.js');

});
