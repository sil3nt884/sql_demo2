const pg = require('../pg/data');
const {sendRconCommand} = require("../minecraft_rcon/command");


module.exports = async (req, res) => {
  const {
      player,
      item,
      amount
  } = req.body;

  const response = await sendRconCommand(`give ${player} ${item} ${amount}`)
  return res.send(response);
}