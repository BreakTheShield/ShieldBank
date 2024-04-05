var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "rds-swordbank-new.czmsy2g2m4cg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "ahdmlgozld13!#",
  database: "board",
  dateStrings: "date",
});
module.exports = db;
