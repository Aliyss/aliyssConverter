
let iterate = (obj, arr) => {
	if (arr.length > 1) {
		let x = arr.pop();
		return iterate(obj[x], arr);
	}
	return obj[arr[0]];
}

class Message {
	
	constructor(props) {
		this.id = props.id;
		this.author = props.author;
		this.channel = props.channel;
		this.content = props.content;
		this.type = props.type;
		this.message = props.message;
		this.route = props.route;
		this.sender = props.sender;
	}
	
	send = (content) => {
		this.route[this.sender](content)
	}
}

module.exports = Message;