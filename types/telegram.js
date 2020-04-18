
exports.message = (_message) => {

}

exports.user = (props) => {
	let user = props._user

	props.id = user.id;
	props.bot = false;
	props.author = user;

	return props
}

exports.channel = (props) => {
	let channel = props._channel
	
	props.id = channel.id;
	props.channel = channel;
	
	return props
}

exports.channelGroup = (_channelGroup) => {

}