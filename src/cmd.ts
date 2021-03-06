import TelegramBot = require('node-telegram-bot-api')
import { Message } from 'node-telegram-bot-api'
import * as db from './db'
import { MIN_SIMILARITY, MAX_RESULT_COUNT } from './defaultvalues'

export function help(bot: TelegramBot, msg: Message) {
	bot.sendMessage(
		msg.chat.id,
		`Send or forward a image here, and I will search it on SauceNAO for you!
You can use /get or /set to change some settings.
Source Code: [maple3142/saucenao-search-tgbot](https://github.com/maple3142/saucenao-search-tgbot)
View sponsors: /sponsors`,
		{
			parse_mode: 'Markdown'
		}
	)
}
export const start = help

const sponsorsList = [{ sponsor: '@AnimeChannel', amount: '10 USD' }]
	.map(d => `${d.sponsor} ${d.amount}`)
	.join('\n')
export function sponsors(bot: TelegramBot, msg: Message) {
	bot.sendMessage(
		msg.chat.id,
		`I sincerely thanks these people for donating so that everyone can still enjoy this bot.

${sponsorsList}

If you want to donate to help me paying to bill of SauceNAO premium, please contact @maple3142. By donating, your name will be added to the list.`,
		{ parse_mode: 'Markdown' }
	)
}

const SUPPORTED_VALUES = {
	min_s: 'Mininum similarity',
	max_rc: 'Maximum result count'
}
const UNSUPPORTED_MSG =
	'Configurable values:\n' +
	Object.entries(SUPPORTED_VALUES)
		.map(([k, v]) => `${k}: ${v}`)
		.join('\n')
export async function set(
	bot: TelegramBot,
	msg: Message,
	cfg: string,
	val: string
) {
	if (cfg === 'min_s') {
		const min_s = parseInt(val)
		if (isNaN(min_s)) {
			return bot.sendMessage(msg.from!.id, 'Invalid minium similarity.')
		}
		await db.setUserData(msg.from!.id, 'min_similarity', min_s)
		bot.sendMessage(
			msg.chat.id,
			'Minium similarity has been successfully updated.'
		)
	} else if (cfg === 'max_rc') {
		const max_rc = parseInt(val)
		if (isNaN(max_rc)) {
			return bot.sendMessage(
				msg.from!.id,
				'Invalid maximum result count.'
			)
		}
		await db.setUserData(msg.from!.id, 'max_result_count', max_rc)
		bot.sendMessage(
			msg.chat.id,
			'Maximum result count has been successfully updated.'
		)
	} else {
		bot.sendMessage(msg.chat.id, UNSUPPORTED_MSG)
	}
}
export async function get(bot: TelegramBot, msg: Message, cfg: string) {
	if (cfg === 'min_s') {
		bot.sendMessage(
			msg.from!.id,
			(
				await db.getUserData(
					msg.from!.id,
					'min_similarity',
					MIN_SIMILARITY
				)
			).toString()
		)
	} else if (cfg === 'max_rc') {
		bot.sendMessage(
			msg.chat.id,
			(
				await db.getUserData(
					msg.from!.id,
					'max_result_count',
					MAX_RESULT_COUNT
				)
			).toString()
		)
	} else {
		bot.sendMessage(msg.chat.id, UNSUPPORTED_MSG)
	}
}
