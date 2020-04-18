const Message = require('./Message')

class Command extends Message {

	constructor(_msg) {
		super(_msg);
		
		this.content = _msg.content;
		
		this.prefixes = (_msg.layout && _msg.layout.prefixes)
			? _msg.layout.prefixes : [`aliyss`];
		this.splitters = (_msg.layout && _msg.layout.splitters)
			? _msg.layout.splitters : [' '];
		this.suffixes = (_msg.layout && _msg.layout.suffixes)
			? _msg.layout.suffixes : [];
		this.smartsplit = (_msg.layout && _msg.layout.smartsplit)
			? _msg.layout.smartsplit : false
		
		this.cleanContent = this.getCleanContent();
		
		this.isPrefixed = !!this.cleanContent;
		
		if (this.isPrefixed) {
			this.arrayContent = this.getArrayContent();
		}
		
	}

	getCleanContent = (content = this.content,
					   prefixes = this.prefixes,
					   suffixes = this.suffixes) => {
		if (!content) {
			//console.log(this);
			return
		}
		for (let i = 0; i < prefixes.length; i++) {
			if (content.startsWith(prefixes[i])) {
				this.prefix = prefixes[i]
				return this.suffixRemover(content.substring(prefixes[i].length), suffixes)
			}
		}
		return null
	}

	suffixRemover = (content = this.content, suffixes = this.suffixes) => {
		for (let i = 0; i < suffixes.length; i++) {
			if (content.startsWith(suffixes[i])) {
				this.suffix = suffixes[i]
				return content.substring(suffixes[i].length)
			}
		}
		return content
	}
	
	getArrayContent = (content= this.cleanContent,
					   splitters = this.splitters,
					   suffix = this.suffix,
					   smartsplit = this.smartsplit) => {
		
		if (!content) {
			return null;
		}
		if (!suffix) {
			for (let i = 0; i < splitters.length; i++) {
				if (content.startsWith(splitters[i])) {
					this.splitter = splitters[i]
					return content.substring(splitters[i].length).split(splitters[i])
				}
			}
		}
		if (smartsplit || !splitters[0]) {
			let rSplit = content.match(smartsplit)
			this.splitter = rSplit
			return content.split(rSplit)
		}
		this.splitter = splitters[0]
		return content.split(content.startsWith(splitters[0]))
	}
}

module.exports = Command;