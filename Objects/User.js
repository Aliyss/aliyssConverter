
class User {
	
	constructor(props) {
		this.id = props.id;
		this.author = props.author ? props.author : props.user;
		this.bot = props.bot;
		this.fullname = props.fullname
		this.cleanname = props.cleanname
		this.avatarUrl = props.avatarUrl
		
		if (props.context) {
			this.context = props.context
		}
	}
	
}

module.exports = User;