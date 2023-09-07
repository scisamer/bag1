// libs
const { Context, Telegraf, Markup } = require('telegraf');
const { session } = require('telegraf');
const db = require('../database/db');
const { getGruopRun } = require("./startStop");

async function security(ctx, next) {
	if (!ctx.message) return next();
	if (ctx.message.chat.type == "group") {
		if (getGruopRun() === false) {
			return false;
		}
	}

	if (ctx.session == undefined) {
		ctx.session = {};
		var uid = ctx.message.from.id;

		var usr = await db.users.asyncFindOne({ id: uid });
		if (usr === null) {
			db.users.asyncInsert({ "id": uid, "group": "user" });
			ctx.session.group = "user";
			ctx.session.isAdmin = ctx.session.group == 'admin' || ctx.session.group == 'dev';
			ctx.session.isDev = ctx.session.group == 'dev';
		}
		else {
			ctx.session.group = usr.group;
			ctx.session.isAdmin = ctx.session.group == 'admin' || ctx.session.group == 'dev';
			ctx.session.isDev = ctx.session.group == 'dev';
		}

	}


	next();
}

module.exports = security;