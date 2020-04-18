const converterInput = require('./converterInput')

exports.userByChannelGroup = async (query, _instance, _channelGroup) => {
	let _member = await require(`./types/${_instance.type}.js`).userByChannelGroup(query, _channelGroup, _instance)
	return await converterInput.member(_member, _instance)
}