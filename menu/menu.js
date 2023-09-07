const fs = require('fs');
const menu = [];
menu.get = () => {
	const list = require("./list.json");
	return list;
}

menu.set = (index, text) => {
	const list = menu.get();
	if (list[index] === undefined) return false;
	list[index] = text;
	fs.writeFileSync("../menu/list.json", JSON.stringify(list,null,4), 'utf8');
	return true;
}

menu.getData = (index) => {
	const data = require("./data.json");
	if (index !== undefined) return data.find(key => key.index == index);
	return data;
}

menu.addData = (index,title,fileId) => {
	const data = menu.getData();
	var item = data.find(key => key.index == index);
	if (!item) {
		item = {index, files:[]}
		data.push(item)
	}
	item.files.push({title:title,id:fileId});
	fs.writeFileSync("./menu/data.json", JSON.stringify(data,null,4), 'utf8');

}

menu.getFileByTime = title => {
	const data = menu.getData();
	var fileId = null;
	for (const btn of data) {
		const file = btn.files.find(key => key.title == title);
		if (file) {
			fileId = file.id;
			break;
		}
	}
	return fileId;
}

menu.empty = (index) => {
	const data = menu.getData();
	const btn = data.find(key => key.index == index);
	if (!btn) return menu.get()[index];
	btn.files = [];
	fs.writeFileSync("./menu/data.json", JSON.stringify(data,null,4), 'utf8');
	return menu.get()[index];
}

menu.getIndexByText = text => {
	const list = menu.get();
	return list.indexOf(text)

}


module.exports = menu;