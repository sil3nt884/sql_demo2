 const pg  = require('pg');


 const client = new pg.Client({
     host: 'localhost',
     port: 5432,
     database: 'postgres',
     user: 'postgres',
     password: 'password'

 });
const connect = async () => {
    return new Promise((resolve, reject) => {
      client.connect((err) => {
          if (err) reject(err)
          resolve()
      })
    })
}

 const query = async (query) => {
    return new Promise((resolve, reject) => {
        client.query(query, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
 }

const disconnect = async () => {
    return new Promise((resolve, reject) => {
        client.end((err) => {
            if (err) reject(err)
            resolve()
        })
    })
}

module.exports ={connect, query, disconnect}


