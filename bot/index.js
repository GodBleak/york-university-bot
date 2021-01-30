'use strict';

const ms = require('millisecond');
const { Telegraf } = require('telegraf');
const { config } = require('../utils/config');

/** @typedef { import('../typings/context').ExtendedContext } ExtendedContext */

/** @type { Telegraf<ExtendedContext> } */
const bot = new Telegraf(config.token, {
	handlerTimeout: ms('5s'),
	telegram: { apiRoot:'https://bot.api.telegram.secureline.ca' },
});
bot.command('submitToChannel', ctx => {
	if(!ctx.message.reply_to_message) return ctx.reply(`Please reply with this command to the message you'd like to submit`)
	ctx.telegram.sendCopy(Number(config.chats.report), ctx.message.reply_to_message, {reply_markup:{InlineKeyboard:[
		[
			{text: 'Send To Channel', data: 'sendToChannel'}, {text: 'Reject submission', data: 'deleteMessage'}
		]
	]}})
})
bot.action('sendToChannel',ctx => {
	ctx.telegram.sendCopy( -1001374765591, ctx.callbackQuery.message)
})
bot.action('deleteMessage', ctx => {
	ctx.deleteMessage(ctx.callbackQuery.message.message_id)
})
if (process.env.NODE_ENV === 'development') {
	bot.polling.offset = -1;
}

module.exports = bot;

// cyclic dependency
// bot/index requires context requires actions/warn requires bot/index
Object.assign(bot.context, require('./context'));
