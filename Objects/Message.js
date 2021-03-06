
class Message {
	
	constructor(props) {
		this.id = props.id;
		this.author = props.author;
		this.channel = props.channel;
		this.channelGroup = props.channelGroup;
		this.content = props.content;
		this.type = props.type;
		this.message = props.message;
		this.createdTimestamp = props.createdTimestamp;
		this.layout = props.layout
		
		this.sender = props.sender ? props.sender : 'reply';

		this.preSend = props.preSend ? props.preSend : null;
		
		if (props.quotedMessage) {
			this.quotedMessage = props.quotedMessage
		}
		
		if (props.route) {
			this.route = props.route;
		}

		if (props.reaction) {
			this.reaction = props.reaction;
		}
		
	}
	
	send = (content, options) => {
		
		if (this.preSend) {
			if (this.route && typeof this.route === 'string') {
				return this.message[this.route][this.sender](this.preSend, content, options)
			} else if (this.route && typeof this.route === 'object') {
				return this.route[this.sender](this.preSend, content)
			}
		}
		
		if (this.route && typeof this.route === 'string') {
			return this.message[this.route][this.sender](content, options)
		} else if (this.route && typeof this.route === 'object') {
			return this.route[this.sender](content, options)
		}
		
		if (options) {
			return this.message[this.sender](content, options)
		}
		
		return this.message[this.sender](content)
	}
	
}

module.exports = Message;