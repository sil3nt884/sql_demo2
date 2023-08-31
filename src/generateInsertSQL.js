
const fs = require('fs');
const path = require('path');


// Load the items.json
const itemsData = JSON.parse(fs.readFileSync('items/items.json', 'utf-8'));
const imageData  = JSON.parse(fs.readFileSync('items/item_images.json', 'utf-8'));


const insertSQL = [];
itemsData.forEach(item => {
    console.log(item)
    const image = imageData.find(image => image.itemId === item.id);
    const sqlItem = `INSERT INTO items (id, name, minecraft_name) VALUES ('${item.id}', '${item.name}', '${item.minecraftName}');`;
    const imageInsert  = image ?  `INSERT INTO item_images (id, item_id, path) VALUES ('${image.id}', '${image.itemId}', '${image.path}');` : ''
    insertSQL.push(sqlItem);
    insertSQL.push(imageInsert);
})

fs.writeFileSync('../sql/insert.sql', insertSQL.join('\n'));