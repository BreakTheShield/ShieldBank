var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "rds-sword.czmsy2g2m4cg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "gozld13!#",
  database: "board",
  dateStrings: "date",
});
module.exports = db;
