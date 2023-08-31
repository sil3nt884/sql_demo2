const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load the items.json
const itemsData = JSON.parse(fs.readFileSync('items/items.json', 'utf-8'));

// Directory where the textures are stored
const texturesDirectory = 'minecraft_texture/textures'; // Replace with the path to your textures

function findFileInDir(dir, filename) {
    let filePath;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filePath = findFileInDir(path.join(dir, file), filename);
            if (filePath) return filePath;
        } else if (file.startsWith(filename)) {
            return path.join(dir, file);
        }
    }
    return null;
}
const imageData = [];
itemsData.forEach(item => {
    const imageName = `${item.minecraftName.replace("minecraft:", '')}.png`;
    const imagePath = findFileInDir(texturesDirectory, imageName);
    let imageImages =  { id :  crypto.randomUUID(), itemId : item.id, path: null}

    if (imagePath) {
        imageImages =  {...imageImages, path: imagePath}
        imageData.push(imageImages);
    }
});


fs.writeFileSync('items/item_images.json', JSON.stringify(imageData, null, 4));
console.log("Done!")
