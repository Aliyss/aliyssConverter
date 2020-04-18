const merge = require('deepmerge')

exports.layouts = (cmd, _instance) => {
	
	let userLayout = {}
	let channelLayout = {}
	let channelGroupLayout = {}
	
	if (cmd.author && cmd.author.layout) {
		userLayout = cmd.author.layout
	}
	
	if (cmd.channel && cmd.channel.layout) {
		channelLayout = cmd.channel.layout
	}
	
	if (cmd.channelGroup && cmd.channelGroup.layout) {
		channelGroupLayout = cmd.channelGroup.layout
	}
	
	let instanceLayout = _instance.layout;
	
	return mergeLayouts([instanceLayout, channelGroupLayout, channelLayout, userLayout])
}

const mergeLayouts = (arr) => {
	const overwriteMerge = (destinationArray, sourceArray) => sourceArray
	return merge.all(arr, { arrayMerge: overwriteMerge })
}