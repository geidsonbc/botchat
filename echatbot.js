function Bot(obj) {

	this.properties = {
		avatar: 'dist/images/robot.png',
		message: 'Olá! Posso ajudar?',
		botName: 'Jamal'
	};

	$.extend(this.properties, obj);


	this.events = function() {
		var selectorId = $('#'+this.properties.botId);
		selectorId.on('click', '.ev-open-chat', this.chatShow);
		selectorId.on('click', '.ev-close-chat', this.chatHide);
		selectorId.on('keyup', '.ev-add-message', this.setMessage);
	};

	this.start = function() {


		this.templateFloat =
			'<div class="ecb-float-container ev-open-chat">'+
				'<div class="ecb-float-message">'+
					this.properties.message +
				'</div>'+
				'<img src="'+ this.properties.avatar +'" class="ecb-float-icon"/>'+
			'</div>';

		this.templateChat =
			'<div class="ecb-chat">'+
				'<div class="ecb-chat-header">'+
					'<div class="ecb-chat-header-title">'+ this.properties.botName +'</div>'+
					'<div class="ecb-chat-header-close ev-close-chat">'+
						'<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
							'<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>'+
							'<path d="M0 0h24v24H0z" fill="none"></path>'+
						'</svg>'+
					'</div>'+
				'</div>'+
				'<div class="ecb-chat-body">'+
				'</div>'+
				'<div class="ecb-chat-footer">'+
					'<input type="text" placeholder="Digite aqui..." class="ev-add-message"/>'+
				'</div>'+
			'</div>';

		this.properties.botId = 'ecb-'+Date.now();
		this.selector = '#'+this.properties.botId;
		$('body').append('<div id="'+ this.properties.botId +'" class="ecb">'+ this.templateFloat + this.templateChat + '</div>');
		this.events();

		setTimeout(function() {
			this.floatShow();
		}.bind(this), 300);
	};

	this.floatShow = function() {
		$('#'+this.properties.botId).find('.ecb-float-container').css('transform', 'scale(1)');
	};

	this.floatHide = function() {
		$('#'+this.properties.botId).find('.ecb-float-container').css('transform', 'scale(0)');
	};

	this.chatShow = function() {
		var chatTarget = $('#'+this.properties.botId);
		this.floatHide();
		chatTarget.find('.ecb-chat').css('transform', 'scale(1)');
		chatTarget.find('.ecb-chat-footer input').focus();
	}.bind(this);

	this.chatHide = function() {
		this.floatShow();
		$('#'+this.properties.botId).find('.ecb-chat').css('transform', 'scale(0)');
	}.bind(this);

	this.setMessage = function(e) {
		var chat = $('#'+this.properties.botId);
		chat.trigger('bot:writing', { bot: this, message: $(e.currentTarget).val() });
		if(e.keyCode == 13 && e.currentTarget.value.length) {
			var message = $(e.currentTarget).val();
			obj = {
				'message': message,
				'human': true,
				'timestamp': Date.now(),
				'typeMessage': 'text'
			};

			this.add(obj);

			chat.trigger('bot:send', {
				bot:this,
				dialog: obj,
				lastMessage: this.lastMessage
			});

			this.lastMessage = obj;
			$(e.currentTarget).val('');
		}
	}.bind(this);

	//Adiciona mensagem no corpo do chat
	this.add = function(obj) {
		if(typeof obj.messageType == 'undefined' || obj.messageType == 'text') {
			obj.template = this.templateMessageText;
		}
		else if(obj.messageType == 'option') {
			obj.template = this.templateMessageText;
		}

		var body = $('#'+this.properties.botId).find('.ecb-chat-body');
		body.append(this.template(obj) );
		body[0].scrollTop = body[0].scrollHeight;
	};

	this.template = function(obj) {
		var avatar = this.properties.avatar;
		var position = '';

		if(obj.human) {
			position = 'ecb-ts--right';
			avatar = '';
		}

		var html =
			'<div class="ecb-ts '+ position +'">'+
				'<img src="'+ avatar +'" class="ecb-ts-avatar"/>'+
				obj.template(obj) +
			'</div>';

		return html;
	}.bind(this);

	this.templateMessageText = function(obj) {
		return '<div class="ecb-ts-bubble">'+ obj.message +'</div>';
	};

	this.templateMessageOptions = function(obj) {
		var html =
			'<div class="ecb-ts-bubble ecb-ts-bubble-options">'+
				'<div class="ecb-ts-message">'+ obj.message + '</div>'+
				'<div class="ecb-ts-buttons">'+
					'<button class="ecb-button ecb-button-white">Sim</button>'+
					'<button class="ecb-button ecb-button-white">Não</button>'+
				'</div>'+
			'</div>';
		return html;
	};

	this.typing = function() {
		var html =
		'<div class="ecb-ts ecb-ts-typing">'+
			'<img src="" class="ecb-ts-avatar"/>'+
			'<div class="ecb-ts-bubble">'+
				'<div class="ecb-typing">'+
					'<div class="dot"></div>'+
					'<div class="dot"></div>'+
					'<div class="dot"></div>'+
				'</div>'+
			'</div>'+
		'</div>';

		$('#'+this.properties.botId).find('.ecb-chat-body').append(html);
		$('#'+this.properties.botId).find('.ev-add-message').prop('disabled', true);

	}.bind(this);

	this.rmTyping = function() {
		$('#'+this.properties.botId).find('.ecb-chat-body .ecb-ts-typing').remove();
		$('#'+this.properties.botId).find('.ev-add-message').prop('disabled', false).focus();
	};

	this.start();
}
