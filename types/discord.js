const Unzalgo = require("unzalgo");

exports.message = (_message) => {

}

exports.user = (props) => {
	let user = props._user
	
	props.id = user.id;
	props.bot = user.bot;
	props.author = user;
	props.fullname = user.username
	props.cleanname = Unzalgo.clean(user.username);
	props.context.username = user.username
	props.avatarUrl = user.displayAvatarURL() + "?size=2048"

	return props
}

exports.userByChannelGroup = async (query, { channelGroup }) => {

	let members = await channelGroup.members.fetch()
	
	let member;
	
	if (members.find(value => Unzalgo.clean(value.nickname ? value.nickname.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.nickname ? value.nickname.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	} else if (members.find(value => Unzalgo.clean(value.user.username ? value.user.username.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.user.username ? value.user.username.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	}  else if (members.find(value => value.user.id.startsWith(query.trim()))) {
		member = members.find(value => value.user.id.startsWith(query.trim()))
	}
	
	let _roles = {
		roles: []
	}
	
	if (!member) {
		throw new Error('User not found')
	}
	
	for (let i = 0; i < member._roles.length; i++) {
		_roles.roles.push((await channelGroup.roles.fetch(member._roles[i])))
	}
	
	return { ...member, ..._roles }
}

exports.channel = (props) => {
	let channel = props._channel
	
	props.id = channel.id;
	props.channel = channel;
	
	return props
}

exports.channelGroup = (_channelGroup) => {

}