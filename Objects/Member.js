const User = require('./User')

class Member extends User {

	constructor(props) {
		super(props.user);
		
		this.roles = props.roles
		this.deleted = props.deleted
		this.nickname = props.nickname
		
		this.member = props
	}
	
}

module.exports = Member;
