
class User {
	
	constructor(props) {
		this.id = props.id;
		this.author = props.author;
		this.bot = props.bot;
		
		if (props.context) {
			this.context = props.context
		}
	}
	
}

module.exports = User;