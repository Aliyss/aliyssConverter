const {MessageMedia} = require("whatsapp-web.js");
const fetch = require('node-fetch');


exports.embedToText = async (content) => {
	let options;
	if (content.embed) {
		let text = "";
		let embed = content.embed;

		if (embed.title) {
			text += "**" + embed.title.trim() + "**" + "\n";
		}

		if (embed.description) {
			text += "\n" + embed.description.trim() + "\n";
		}

		if (embed.fields) {
			for (let i = 0; i < embed.fields.length; i++) {
				if (embed.fields[i].name === "_\n_" && embed.fields[i].value === "_\n_") {
					continue;
				}
				text += "\n" + embed.fields[i].name.trim().replace("_\n_", "");
				text += "\n" + embed.fields[i].value.toString().trim().replace("_\n_", "") + "\n";
			}
		}

		text = text.replace(/\*\*/g, "*");
		text = text.replace(/``/g, "```");
		text = text.replace(/````/g, "```");
		text = text.replace(/```py\n/g, "```");
		text = text.replace(/```css\n/g, "```");
		text = text.replace(/⠀/g, "");

		if (embed.image && embed.image.url && content.files) {
			content = new MessageMedia('image/png', content.files[0].attachment.read().toString('base64'))
			options = {
				caption: text
			}
		} else if (embed.image && embed.image.url) {
			let base64Imgage = await fetch(embed.image.url).then(r => r.buffer()).then(buf => {
				return buf.toString('base64')
			});
			content = new MessageMedia('image/jpg', base64Imgage)
			options = {
				caption: text
			}
		} else {
			content = text
		}

	} else {

		let text = content.content ? content.content : content;

		text = text.replace(/\*\*/g, "*");
		text = text.replace(/``/g, "```");
		text = text.replace(/````/g, "```");
		text = text.replace(/```py\n/g, "```");
		text = text.replace(/```css\n/g, "```");
		text = text.replace(/⠀/g, "");

		content = text
	}
	return {content, options};
}

exports.embedToText2 = (content) => {
	let options;
	if (content.options) {
		options = content.options
	}
	if (content.embed) {
		let text = "";
		let embed = content.embed;

		if (embed.title) {
			text += "**" + embed.title.trim() + "**" + "\n";
		}

		if (embed.description) {
			text += "\n" + embed.description.trim() + "\n";
		}

		if (embed.fields) {
			for (let i = 0; i < embed.fields.length; i++) {
				if (embed.fields[i].name === "_\n_" && embed.fields[i].value === "_\n_") {
					continue;
				}
				text += "\n" + embed.fields[i].name.trim().replace("_\n_", "");
				text += "\n" + embed.fields[i].value.toString().trim().replace("_\n_", "") + "\n";
			}
		}

		if (embed.image) {

		}
		
		text = text.replace(/⠀/g, "");

		content = text;
	} else {

		let text = content.content ? content.content : content;
		
		text = text.replace(/⠀/g, "");
		
		content = text
	}
	return { content, options };
}