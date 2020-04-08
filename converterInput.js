const { Message, Command, User, Channel } = require("./Objects")
const converterHandler = require("./converterHandler");

exports.message = async (ctx, _instance, repeat=true) => {
	let props = {
		author: {},
		channel: {},
	}
	
	switch (_instance.type) {
		case 'whatsapp':
			props.id = ctx.id.id;
			props.author = await this.user(await ctx.getContact(), _instance)
			props.channel = await this.channel(ctx, _instance)
			props.content = ctx.body;
			props.type = ctx.type;
			props.route = 'client';
			props.sender = 'sendMessage';
			props.preSend = props.channel.id;
			props.message = ctx;
			props.createdTimestamp = ctx.timestamp;
			if (ctx.hasQuotedMsg && repeat) {
				let quoteElement = await ctx.getQuotedMessage();
				props.quotedMessage = await this.message(quoteElement, _instance, false);
			}
			break;
		case 'discord':
			props.id = ctx.id;
			props.author = await this.user(ctx.author, _instance)
			props.channel = await this.channel(ctx.channel, _instance)
			ctx.hasQuotedMsg = false
			if (ctx.content.startsWith('> ') && repeat) {
				ctx.hasQuotedMsg = [];
				let tempContent = ctx.content.split('\n');
				ctx.content = '';
				for (let i = 0; i < tempContent.length; i++) {
					if (tempContent[i].startsWith('> ')) {
						if (i === tempContent.length - 1 && !ctx.content) {
							ctx.content += tempContent[i]
						} else {
							ctx.hasQuotedMsg.push(tempContent[i])
						}
					} else {
						ctx.content += tempContent[i]
					}
				}
			}
			props.content = ctx.content;
			props.type = ctx.type;
			props.route = 'channel'
			props.sender = 'send'
			props.message = ctx
			props.createdTimestamp = ctx.createdTimestamp;
			if ((ctx.hasQuotedMsg || ctx.hasQuotedMsg.length > 0) && repeat) {
				ctx.content = ctx.hasQuotedMsg.join('\n');
				props.quotedMessage = await this.message(ctx, _instance, false);
			}
			break;
		case 'telegram':
			props.id = ctx.message.message_id;
			props.author = await this.user(ctx.message.from, _instance)
			props.channel = await this.channel(ctx.message.chat, _instance)
			props.content = ctx.message.text;
			props.type = 'text';
			props.route = ctx;
			props.sender = 'replyWithMarkdown'
			props.message = ctx.message
			props.createdTimestamp = new Date().getTime();
			if (ctx.message.reply_to_message && repeat) {
				ctx.message.text = ctx.message.reply_to_message.text;
				props.quotedMessage = await this.message(ctx, _instance, false);
			}
			break;
	}
	
	return new Message(props);
	
}

exports.command = async (msg, _instance) => {
	let message = await this.message(msg, _instance)
	return new Command(message, _instance);
}

exports.convertDefault = (content, _instance) => {
	if (!_instance.converterHandler) {
		_instance.converterHandler = this.addConverterHandler(_instance.type)
	}
	
	
	if (content.command) {
		content = content.command
	}
	
	switch (_instance.converterHandler.returnType) {
		case 'text':
			return converterHandler.embedToText(content);
		case 'default':
		default:
			return content;
	}
}

exports.addConverterHandler = (_instanceType) => {
	let converterHandler = {}
	
	switch (_instanceType) {
		case 'telegram':
		case 'whatsapp':
			converterHandler.returnType = 'text'
			break;
		case 'discord':
		default:
			converterHandler.returnType = 'default'
			break;
	}
	
	return converterHandler
}

exports.user = async (user, _instance) => {
	let props = {
		context: {}
	}
	
	switch (_instance.type) {
		case 'whatsapp':
			props.id = user.id._serialized;
			props.bot = false;
			props.author = user;
			props.context.username = user.shortName || user.name
			break;
		case 'discord':
			props.id = user.id;
			props.bot = user.bot;
			props.author = user;
			props.context.username = user.username
			break;
		case 'telegram':
			props.id = user.id;
			props.bot = false;
			props.author = user;
			break;
	}

	let _user = await _instance.getUser(props.id)
	if (_user) {
		return _user
	}
	let newUser = new User(props)
	return await _instance.getUser(props.id, newUser)
}

exports.channel = async (channel, _instance) => {
	let props = {
		context: {}
	}

	switch (_instance.type) {
		case 'whatsapp':
			props.id = channel.id.remote._serialized || channel.id.remote;
			props.channel = channel;
			break;
		case 'discord':
			props.id = channel.id;
			props.channel = channel;
			break;
		case 'telegram':
			props.id = channel.id;
			props.channel = channel
			break;
	}

	let _channel = await _instance.getChannel(props.id)
	if (_channel) {
		return _channel
	}
	let newChannel = new Channel(props)
	return await _instance.getChannel(props.id, newChannel);
}