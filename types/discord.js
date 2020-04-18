
exports.message = (_message) => {

}

exports.user = (props) => {
	let user = props._user
	
	props.id = user.id;
	props.bot = user.bot;
	props.author = user;
	props.context.username = user.username

	return props
}

exports.userByChannelGroup = async (query, { channelGroup }) => {

	const Unzalgo = require("unzalgo");

	let members = await channelGroup.members.fetch()
	
	let member;
	
	if (members.find(value => Unzalgo.clean(value.nickname ? value.nickname.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.nickname ? value.nickname.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	} else if (members.find(value => Unzalgo.clean(value.user.username ? value.user.username.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.user.username ? value.user.username.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	}  else if (members.find(value => value.user.id.startsWith(query.trim()))) {
		member = members.find(value => value.user.id.startsWith(query.trim()))
	}

	member.user.cleanName = Unzalgo.clean(member.user.username);
	
	return { ...member }
}

exports.channel = (props) => {
	let channel = props._channel
	
	props.id = channel.id;
	props.channel = channel;
	
	return props
}

exports.channelGroup = (_channelGroup) => {

}