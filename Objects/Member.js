const User = require('./User')

class Member extends User {

	constructor(_member) {
		super(_member.user);
		
		this.roles = _member.roles
		this.deleted = _member.deleted
		this.nickname = _member.nickname
		this.member = _member
	}
	
}

module.exports = Member;
