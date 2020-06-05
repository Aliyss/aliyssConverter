
exports.getTag = (emoji) => {
	switch (emoji.name) {
		case '☀':
		case '⚡':
		case '❄':
		case '☔':
		case '🌈':
		case '☁':
		case '🌅':
		case '🌧':
		case '🌤':
		case '🌪':
		case '⛈':
		case '🌬':
		case '⛅':
		case '⛱':
		case '🌨':
		case '🌩':
		case '🌥':
		case '🌫':
		case '🌦':
		case '☂':
			return 'weather'
		case '😷':
		case '🤢':
		case '🤮':
		case '🤧':
		case '🤒':
		case '🤕':
		case '🚑':
		case '💊':
		case '💉':
		case '🦠':
		case '🧼':
		case '🧽':
			return 'corona'
	}
}