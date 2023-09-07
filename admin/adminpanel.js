const { Markup } = require("telegraf");
const { getRun } = require("../bot/startStop");
const adminBack = "رجوع 🔙";
async function showAdminPanel(ctx, path, type) {
    var s = getRun() ? "نشط ✅" : "معطل ❌";

    var buttons;

    if (path == 1) {
        buttons = [
            [
                Markup.button.callback('ادارة الحقائب 💼', 'manger'),
                Markup.button.callback('اضافة ملفات 📁', 'addpdf')
            ],
        [
            Markup.button.callback(`حالة البوت ${s}`, 'runBot'),
            Markup.button.callback('اذاعة رسالة 🔊', 'sendToAll'),
        ],
        [
            Markup.button.callback('عدد المشركين 👥', 'listAll'),
        ]
    ]
    }
    else if (path == 2) {
        const menu = require("../menu/menu").get();
        buttons = [];
        for (let i in menu) {
            buttons.push([
                Markup.button.callback(menu[i], `item-${i}`),
            ])
        }
        buttons.push([Markup.button.callback(adminBack, `back-1`)]);
    }

    else if (path == 3) {
            buttons = [[
                Markup.button.callback("تعديل النص", `set-text`),
                Markup.button.callback("تفريغ من جميع الملفات", `empty`)
            ],
        ]
        buttons.push([Markup.button.callback(adminBack, `back-2`)]);
        }

        else if (path == 4) {
            const menu = require("../menu/menu").get();
            buttons = [];
            for (let i in menu) {
                buttons.push([
                    Markup.button.callback(menu[i], `addto-${i}`),
                ])
            }
            buttons.push([Markup.button.callback(adminBack, `back-1`)]);
        }


    const broadcastButtons = buttons.map(k => k.reverse());

    const keyboard = Markup.inlineKeyboard(broadcastButtons);
    if (type == "update") {
        await ctx.editMessageReplyMarkup({ inline_keyboard: broadcastButtons });
    } else if (type == "des") {
        // await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        ctx.deleteMessage();
    }
    else {
        await ctx.reply('لوحة تحكم المدير', keyboard);
    }
}


module.exports = { showAdminPanel };