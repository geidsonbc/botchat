$(function() {
	var bot = new Bot({ botName: 'IBot', message: 'Olá, posso ajudar?'} );
	botId = $(bot.selector);

	botId.on('bot:send', function(e, data) {
		bot.typing();
		$.post('url', { query: data.dialog.message }, function(res) {

			obj = {
				'message': res.text,
				'human': false,
				'timestamp': Date.now(),
				'typeMessage': 'text'
			};

			bot.add(obj);
		})
		.always(function() {
			bot.rmTyping();
		})
		.fail(function(e) {
			bot.add({
				message: e.status + ' ' + e.statusText,
				human: false,
				typeMessage: 'text'
			});
		});

	});
});
