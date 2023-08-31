const express = require('express');
const bodyParser = require('body-parser');
const pg = require('./pg/data');
const fs = require('fs');
const {disPatchCommand, sendRconCommand} = require("./minecraft_rcon/command");
const cors = require('cors');

(async () => {
    const app  = express()

    await pg.connect();
    app.use(cors());
    app.use(bodyParser.json());

   app.get('/texture/*', (req, res) => {
       const path  = req.path.split('/')
       console.log(path)
       const imagePath = `minecraft_texture/textures/${path[4]}/${path[5]}`;
       return res.sendFile(`${__dirname}/${imagePath}`);
   });
    app.get('/items', require('./routes/items'));
    app.post('/give', require('./routes/give'));

    app.get('/players', async (req, res) => {
        const data = await  sendRconCommand('list');
        const onlinePlayers = data.split(':')[1].split(',').map(player => player.trim());
        return res.send(onlinePlayers);
    });

    app.listen(3000, () => console.log("Listening on port 3000"));

    process.on('SIGINT', async () => {
        await pg.disconnect();
        process.exit();
    })
})()
