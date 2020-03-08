
class Message {
	
	constructor(props) {
		this.id = props.id;
		this.author = props.author;
		this.channel = props.channel;
		this.content = props.content;
		this.type = props.type;
		this.message = props.message;
		this.sender = props.sender ? props.sender : 'reply';
		
		if (props.route) {
			this.route = props.route;
		}
		
	}
	
	send = (content, options) => {
		
		if (this.route && typeof this.route === 'string') {
			return this.message[this.route][this.sender](content)
		} else if (this.route && typeof this.route === 'object') {
			return this.route[this.sender](content, options)
		}
		
		return this.message[this.sender](content)
	}
	
}

module.exports = Message;