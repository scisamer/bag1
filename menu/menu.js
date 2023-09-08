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
	fs.writeFileSync("./menu/list.json", JSON.stringify(list,null,4), 'utf8');
	return true;
}

menu.getData = (index) => {
	const data = require("./data.json");
	if (index !== undefined) return data.find(key => key.index == index);
	return data;
}

menu.addData = (index,fileId,localName,name) => {
	const data = menu.getData();
	var item = data.find(key => key.index == index);
	if (!item) {
		item = {index, files:[]}
		data.push(item)
	}
	item.files.push({id:fileId,localName,name});
	fs.writeFileSync("./menu/data.json", JSON.stringify(data,null,4), 'utf8');

}

menu.getFileByName = name => {
	const data = menu.getData();
	var result = null;
	for (var index in data) {
		const btn = data[index];
		const file = btn.files.find(key => key.name == name);
		if (file) {
			result = {file,index};
			break;
		}
	}
	return result;
}

menu.updateFileId = (index, oldID, newID) => {
	const data = menu.getData();
	const item = data[index];
	const file = item.files.find( k => k.id == oldID );
	if (file) {
		file.id = newID
		fs.writeFileSync("./menu/data.json", JSON.stringify(data,null,4), 'utf8');
	}

}

menu.empty = (index) => {
	const data = menu.getData();
	const btn = data.find(key => key.index == index);
	if (!btn) return menu.get()[index];
	const docPath = process.cwd() + "/documents"
	for (const file of btn.files) {
		const file_path = `${docPath}/${file.localName}`;
		fs.unlinkSync(file_path);
	}
	btn.files = [];
	fs.writeFileSync("./menu/data.json", JSON.stringify(data,null,4), 'utf8');
	return menu.get()[index];
}

menu.getIndexByText = text => {
	const list = menu.get();
	return list.indexOf(text)

}


module.exports = menu;