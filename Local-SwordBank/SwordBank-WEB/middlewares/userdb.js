var mysql = require("mysql2");
var userdb = mysql.createConnection({
  host: "rds-swordbank-new.czmsy2g2m4cg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "ahdmlgozld13!#",
  database: "dvba",
  dateStrings: "date",
});
module.exports = userdb;
