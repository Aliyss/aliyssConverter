const { Message } = require("./Objects")

exports.message = (ctx, _instance) => {
	let props = {
		author: {},
		channel: {},
	}
	
	switch (_instance.type) {
		case 'whatsapp':
			props.id = ctx.id.id;
			props.author.id = ctx.author;
			props.channel.id = ctx.id.remote;
			props.content = ctx.body;
			props.type = ctx.type;
			props.route = ctx
			props.sender = 'reply'
			props.message = ctx
			break;
		case 'discord':
			props.id = ctx.id;
			props.author.id = ctx.author.id;
			props.channel.id = ctx.channel.id;
			props.content = ctx.content;
			props.type = ctx.type;
			props.route = ctx.channel
			props.sender = 'send'
			props.message = ctx
			break;
		case 'telegram':
			props.id = ctx.message.message_id;
			props.author.id = ctx.message.from.id;
			props.channel.id = ctx.message.chat.id;
			props.content = ctx.message.text;
			props.type = 'text';
			props.route = ctx
			props.sender = 'reply'
			props.message = ctx.message
			break;
	}
	
	let message = new Message(props);
	if (message.content === "!test") {
		message.send("test")
	}
}