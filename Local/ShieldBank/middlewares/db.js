var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "board",
  dateStrings: "date",
});
module.exports = db;
