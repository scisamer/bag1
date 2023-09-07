const { getRun, setRun } = require("../bot/startStop");
const { showAdminPanel, showAddData } = require("./adminpanel");
const db = require('../database/db');
const menu = require("../menu/menu");

const { Markup } = require("telegraf");
module.exports = function onAction(bot) {
  bot.action('sendToAll', async (ctx) => {
    // رسالة البث المراد إرسالها إلى المشتركين
    ctx.session.cmd = 'sendtoall';
    ctx.reply(`اكتب رسالتك ليتم ارسالها الى جميع المشتركين`);
    showAdminPanel(ctx, "1", "des");
    return ctx.answerCbQuery(`اكتب رسالتم ليتم ارسالها الى جميع المشتركين`);
  });

  bot.action("runBot", async (ctx) => {
    var isRun = getRun();
    if (isRun) var msg = "تم ايقاف البوت";
    else var msg = "تم تفعيل البوت";
    setRun(!isRun);
    await ctx.answerCbQuery(msg);
    showAdminPanel(ctx, "1", "update");
  });

  bot.action("listAll", async (ctx, e) => {
    var users = await db.users.asyncFind({});
    var message = `عدد المشتركين الكلي: ${users.length}`;

    await ctx.answerCbQuery(message, { show_alert: true });
  });


  bot.action("manger", async (ctx, e) => {
    showAdminPanel(ctx, 2, "update")
    await ctx.answerCbQuery();

  });

  bot.action(/^item-(\d+)$/, async (ctx) => {
    ctx.session.cmdData = ctx.match[1];
    showAdminPanel(ctx, 3, "update");
    await ctx.answerCbQuery();
  });

  bot.action("empty", async (ctx) => {
    const title = menu.empty(ctx.session.cmdData);
    ctx.session.cmdData = null;
    ctx.reply(`تم تفريغ ${title} بنجاح`);
    await ctx.answerCbQuery();
  });

  bot.action("addpdf", async (ctx) => {
    showAdminPanel(ctx, 4, "update");
    await ctx.answerCbQuery();
  });

  bot.action(/^addto-(\d+)$/, async (ctx) => {
    ctx.session.cmdDataItem = ctx.match[1];
    ctx.session.cmd = "addpdf1";
    ctx.reply(`
    اكتب عنوان الملف
    ارسل /cancel للالغاء
    `)
    await ctx.answerCbQuery();
  });

  bot.action(/^back-(\d+)$/, async (ctx) => {
    showAdminPanel(ctx,ctx.match[1], "update" );
    await ctx.answerCbQuery();
  });


  bot.action("set-text", async (ctx) => {
    ctx.reply("ارسل النص الجديد");
    ctx.session.cmd = "settext";
    await ctx.answerCbQuery();
  });
}