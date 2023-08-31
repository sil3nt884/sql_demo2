const pg = require('../pg/data');
const getItems = async () => {
    const result = await pg.query(`
    SELECT 
    minecraft_name as "minecraftName",
     'http://localhost:3000/texture/'|| ii.path as "imagePath"
    FROM items i LEFT JOIN item_images ii ON i.id = ii.item_id`);
    return result.rows;
}

module.exports = async (req, res) => {
    const items = await getItems();
    return res
        .status(200)
        .send(JSON.stringify(items, null, 4).replace(/\\\\/gm, '/'));
}