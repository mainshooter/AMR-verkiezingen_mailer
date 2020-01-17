const mysql2 = require("mysql2/promise");

class Database {

  constructor() {}

  async setup(config) {
    this.pool = mysql2.createPool(config);
  }

  async run(sql, input) {
    let conn = await this.pool.getConnection();
    let [rows, fields] = await conn.query(sql, input);
    conn.release();
    return rows;
  }

}

module.exports = Database;
