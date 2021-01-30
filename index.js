// @ts-check
'use strict';
require('dotenv').config()
process.title = 'yorkUBot'
process.chdir(__dirname);
require('ts-node').register({ transpileOnly: true });

const config = require('./config')
// Utils
const { logError } = require('./utils/log');

const bot = require('./bot');

bot.use(
	require('./handlers/middlewares'),
	require('./plugins'),
	require('./handlers/commands'),
	require('./handlers/regex'),
	require('./handlers/unmatched'),
);

bot.command('submitToChannel', ctx => {
	if(!ctx.message?.reply_to_message) return ctx.reply(`Please reply with this command to the message you'd like to submit`)
	ctx.telegram.sendCopy(Number(config.chats?.report), ctx.message.reply_to_message, {reply_markup:{InlineKeyboard:[
		[
			{text: 'Send To Channel', data: 'sendToChannel'}, {text: 'Reject submission', data: 'deleteMessage'}
		]
	]}})
})
bot.action('sendToChannel',ctx => {
	ctx.telegram.sendCopy( -1001374765591, ctx.callbackQuery?.message)
})
bot.action('deleteMessage', ctx => {
	ctx.deleteMessage(ctx.callbackQuery?.message?.message_id)
})
bot.catch(logError);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.launch({webhook: {domain: 'https://yorku.bots.telegram.secureline.ca', hookPath: '/', port:Number(8888)}})
.then(() => {
	console.info('Telegraf running on port 8888')
})
