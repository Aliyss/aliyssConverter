
exports.message = (props) => {
	
}

exports.user = async (props, _instance) => {
	let user = props._user

	props.id = user.id._serialized;
	props.bot = false;
	props.author = user;
	props.fullname = user.name
	props.cleanname = user.name
	props.context.username = user.shortName || user.name
	props.avatarUrl = await _instance.client.getProfilePicUrl(props.id)

	return props
}

exports.channel = async (props) => {
	let channel = props._channel
	let chat = await channel.getChat()
	
	if (chat.isGroup) {
		return null;
	}
	
	props.id = channel.id.remote._serialized || channel.id.remote;
	props.channel = channel;
	
	return props
}

exports.userByChannelGroup = async (query, { channelGroup }, _instance) => {
	
	const Unzalgo = require("unzalgo");

	const tempMembers = await channelGroup.participants
	
	let q_members = await Promise.all(tempMembers.map(value => {
		return _instance.client.getContactById(value.id._serialized)
	}))
	let members = []
	for (let i = 0; i < q_members.length; i++) {
		members.push({
			...tempMembers[i],
			user: q_members[i]
		})
	}
	let member;

	if (members.find(value =>  Unzalgo.clean(value.user.name ? value.user.name.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.user.name ? value.user.name.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	} else if (members.find(value => Unzalgo.clean(value.user.shortName ? value.user.shortName.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.user.shortName ? value.user.shortName.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	} else if (members.find(value => Unzalgo.clean(value.user.pushName ? value.user.pushName.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))) {
		member = members.find(value => Unzalgo.clean(value.user.pushName ? value.user.pushName.toLowerCase() : '').startsWith(Unzalgo.clean(query.toLowerCase()).trim()))
	} else if (members.find(value => value.id.user.startsWith(query.trim()))) {
		member = members.find(value => value.id.user.startsWith(query.trim()))
	} else if (members.find(value => value.id._serialized.startsWith(query.trim()))) {
		member = members.find(value => value.id._serialized.startsWith(query.trim()))
	}
	
	member.roles = []
	
	if (member.isAdmin) {
		member.roles.push('Admin')
	}
	if (member.isSuperAdmin) {
		member.roles.push('SuperAdmin')
	}
	
	return { ...member }
}

exports.channelGroup = (props) => {

}