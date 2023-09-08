const fs = require("fs");
const db = require('../database/db');
const { getRun } = require("./startStop");
var lodash = require("lodash");
const { Markup } = require('telegraf');
const back = "رجــــوع 🔙";

const menu = require("../menu/menu");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function base(ctx, next) {
	if (!ctx.message) return next();
	var text = ctx.message.text;
	var uid = ctx.message.from.id;
	const type = ctx.message.chat.type;
	const index = menu.getIndexByText(text);
	if (getRun() === false) return next();
	const replyTo = type == "group" ? {reply_to_message_id: ctx.message.message_id} : {};

	if (text == "/help") return ctx.reply(`
	طريقة استخدام البوت:
	`,replyTo);

	if (text == "/start") {
		const menuList = menu.get();
		return await ctx.reply('مرحبا بك', Markup
		.keyboard(menuList)
		.oneTime()
		.resize()
	  )
	}
	else if (text == back) {
		const menuList = menu.get();
		return await ctx.reply('مرحبا بك', Markup
		.keyboard(menuList)
		.oneTime()
		.resize()
	  )
	}

	else if (index > -1) {
		const data = menu.getData(index);
		if (!data || data.files.length == 0) return ctx.reply("لا يوجد محتوى حاليا");
		const btns = data.files.map(k => k.title);
		btns.push(back);
		return await ctx.reply('اختر ما يناسبك', Markup
		.keyboard(btns)
		.oneTime()
		.resize()
	  )
	} else {
		const info = menu.getFileByTime(text);
		if (info) {

			const file = info.file
			ctx.replyWithDocument(file.id,replyTo)
			.then(() => {

			})
			.catch(async e => {
				console.log('eeee');
				const docPath = process.cwd() + "/documents";
				const newFile = await ctx.replyWithDocument({
					source:`${docPath}/${file.localName}`,
					filename: file.name,
				});

				var newID = newFile.document.file_id;
				menu.updateFileId(info.index, file.id, newID);
			})
			return;
		}
		if (type !== "group")
			return next();
	}
}

module.exports = base;