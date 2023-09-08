const { Context, session, Markup } = require('telegraf');
const db = require('../database/db');
var fs = require("fs");
var path = require('path');
const request = require("request-promise");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function command(ctx, next) {
    if (!ctx.message) return next();
    var text = ctx.message.text;
    var uid = ctx.message.from.id;

    if (!(ctx.session.isAdmin && ctx.session.cmd)) return next();

    var cmd = ctx.session.cmd;

    switch (cmd) {
        case 'sendtoall':
            var users = await db.users.asyncFind({});
            var blocked = 0;
            console.log(users);
            for (let i in users) {
                ctx.telegram.sendMessage(users[i].id, text).catch(err => {
                    console.log(`user bloked`);
                    blocked++;
                });
                await delay(100);
            }
            ctx.reply(`تم وصول الاذاعة الى {${users.length - blocked}} بنجاح
            عدد المحظورين: ${blocked}`);
            ctx.session.cmd = null;
            break;
        case 'settext':
            const setMenu = require("../menu/menu").set;
            const check = setMenu(ctx.session.cmdData, text);
            if (check === true) ctx.reply(`تمت العملية بنجاح`);
            else ctx.reply(`فشلت العملية`);
            break;
        case 'addpdf1':
            ctx.session.cmdData = text;
            ctx.session.cmd = "addpdf2";
            if (!text) return ctx.reply(`يرجى كتابة عنوان نصي صالح`);
            ctx.reply("الآن ارسل الملف او المستند");
            break;
        case 'addpdf2':
            const addData = require("../menu/menu").addData;
            // ================================= اذا مو ملف =============================== //
            if (!ctx.message.document) return ctx.reply(`لقد ارسلت رسالة نصية يجب عليك ارسال ملف (مستند) لاضافته`);
            // ============================================================================= //
            const fileId = ctx.message.document.file_id;
            const name = ctx.message.document.file_name;
            const title = ctx.session.cmdData;
            const index = ctx.session.cmdDataItem;


            //===================== احضار رابط الملف من خلال الايدي =================================
            var url = await ctx.telegram.getFileLink(fileId);
            //=========================== احضار المف من خلال الرابط =================================
            const response = await request.get(url.href, { encoding: null });
            const file_ext = path.extname(name);
            const localName = `D${Date.now()}${file_ext}`;
            addData(index, title, fileId, localName, name);
            const docPath = process.cwd() + "/documents"
            fs.writeFileSync(`${docPath}/${localName}`, response);
            ctx.reply("تم انشاء الملف بنجاح");
            ctx.session.cmdData = null;
            ctx.session.cmd = null;
            ctx.session.cmdDataItem = null;
            break;
        case 'setCh':
            ctx.session.cmd = null;
            break;

        default:
            next();
    }


};

module.exports = command;