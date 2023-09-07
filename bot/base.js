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
	const index = menu.getIndexByText(text);
	if (getRun() === false) return next();

	if (text == "/help") return ctx.reply(`
	طريقة استخدام البوت:
	`);

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
		const fileId = menu.getFileByTime(text);
		if (fileId) {
			const receiver_chat_id = ctx.message.from.id;
			ctx.telegram.sendDocument(receiver_chat_id, fileId);
			return;
		}
		return next();
	}
}

module.exports = base;