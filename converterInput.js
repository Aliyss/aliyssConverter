const { Message, Command } = require("./Objects")
const converterHandler = require("./converterHandler");

exports.message = (ctx, _instanceType) => {
	let props = {
		author: {},
		channel: {},
	}
	
	switch (_instanceType) {
		case 'whatsapp':
			props.id = ctx.id.id;
			props.author.id = ctx.author;
			props.author.bot = false;
			props.channel.id = ctx.id.remote;
			props.content = ctx.body;
			props.type = ctx.type;
			props.message = ctx
			break;
		case 'discord':
			props.id = ctx.id;
			props.author.id = ctx.author.id;
			props.author.bot = ctx.author.bot
			props.channel.id = ctx.channel.id;
			props.content = ctx.content;
			props.type = ctx.type;
			props.route = 'channel'
			props.sender = 'send'
			props.message = ctx
			break;
		case 'telegram':
			props.id = ctx.message.message_id;
			props.author.id = ctx.message.from.id;
			props.author.bot = false;
			props.channel.id = ctx.message.chat.id;
			props.content = ctx.message.text;
			props.type = 'text';
			props.route = ctx;
			props.sender = 'replyWithMarkdown'
			props.message = ctx.message
			break;
	}
	
	return new Message(props);
	
}

exports.command = (msg, _instance) => {
	let message = this.message(msg, _instance.type)
	return new Command(message, _instance);
}

exports.convertDefault = (content, _instance) => {
	if (!_instance.converterHandler) {
		_instance.converterHandler = this.addConverterHandler(_instance.type)
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