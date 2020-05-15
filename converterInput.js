const { Message, Command, User, Member, Channel, ChannelGroup } = require("./Objects")
const converterHandler = require("./converterHandler");
const layers = require('./modules/layers')

exports.message = async (ctx, _instance, repeat=true) => {
	
	let props = {
		author: {},
		channel: {},
		channelGroup: {}
	}
	
	switch (_instance.type) {
		case 'whatsapp':
			props.id = ctx.id.id;
			props.author = await this.user(await ctx.getContact(), _instance)
			let chat = await ctx.getChat()
			props.channel = await this.channel(ctx, _instance)
			props.channelGroup = await this.channelGroup(chat, _instance)
			props.content = ctx.body;
			props.type = ctx.type;
			props.route = 'client';
			props.sender = 'sendMessage';
			props.preSend = props.channel ? props.channel.id : props.channelGroup.id;
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
			props.channelGroup = await this.channelGroup(ctx.channel.guild, _instance)
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
		case 'keybase':
			props.id = ctx.id;
			break;
		case 'rest':
			props.id = ctx.body.message.id
			props.content = '> sendtoWhatsapp ' + ctx.body.message.content
			props.message = ctx.body.message
			props.author = await this.user(ctx.body.author, _instance)
			props.channel = await this.channel(ctx.body.channel, _instance)
			props.route = ctx.resultMain;
			props.preSend = 200;
			props.sender = 'json'
			break;
	}

	props.layout = layers.layouts(props, _instance)
	
	return new Message(props);
	
}

exports.command = async (msg, _instance) => {
	let message = await this.message(msg, _instance)
	return new Command(message);
}

exports.convertDefault = (content, _instance, cmd) => {
	if (!_instance.converterHandler) {
		_instance.converterHandler = this.addConverterHandler(_instance.type)
	}
	let embed = false;
	if (cmd.message && cmd.message.guild) {
		let permEmbed = cmd.message.guild.me.permissionsIn(cmd.message.channel).serialize()['EMBED_LINKS']
		if (cmd.message.author.presence.clientStatus && (cmd.message.author.presence.clientStatus.mobile && cmd.message.author.presence.clientStatus.mobile === 'online')) {
			if (cmd.message.author.presence.clientStatus.desktop) {
				if (cmd.message.author.presence.clientStatus.desktop !== 'online') {
					embed = 'mobile'
				}
			} else {
				embed = 'mobile'
			}
		} else if (!permEmbed) {
			embed = 'mobile'
		}
	}
	
	let raaaType = _instance.converterHandler.returnType
	if (embed) {
		raaaType = embed
	}
	
	if (content.command) {
		content = content.command
	}
	
	switch (raaaType) {
		case 'mobile':
			return converterHandler.embedToText2(content);
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
	
	let props = require(`./types/${_instance.type}.js`).user({
		context: {},
		_user: user
	})

	let _user = await _instance.getUser(props.id, new User(props))
	
	return _user
}

exports.member = async (member, _instance) => {
	member.user = await this.user(member.user, _instance)
	return new Member(member)
}

exports.channel = async (channel, _instance) => {
	let props = await require(`./types/${_instance.type}.js`).channel({
		context: {},
		_channel: channel
	})

	if (!props) {
		return null;
	}
	
	let _channel = await _instance.getChannel(props.id)
	
	if (_channel) {
		_channel.channel = channel
		return _channel
	}
	
	let newChannel = new Channel(props)
	return await _instance.getChannel(props.id, newChannel);
}

exports.channelGroup = async (channelGroup, _instance) => {
	let props = {
		context: {}
	}

	switch (_instance.type) {
		case 'whatsapp':
			if (!channelGroup.isGroup) {
				return null;
			}
			props.id = channelGroup.id._serialized;
			props.channelGroup = channelGroup;
			break;
		case 'discord':
			props.id = channelGroup.id;
			props.channelGroup = channelGroup;
			break;
		case 'telegram':
			return null;
			break;
		case 'keybase':
			return null;
			break;
	}

	if (!props) {
		return null;
	}
	
	let _channelGroup = await _instance.getChannelGroup(props.id)
	if (_channelGroup) {
		_channelGroup.channelGroup = channelGroup
		return _channelGroup
	}
	let newChannelGroup = new ChannelGroup(props)
	return await _instance.getChannelGroup(props.id, newChannelGroup);
}