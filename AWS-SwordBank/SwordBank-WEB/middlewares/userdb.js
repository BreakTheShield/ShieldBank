var mysql = require("mysql2");
var userdb = mysql.createConnection({
  host: "rds-sword.czmsy2g2m4cg.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "gozld13!#",
  database: "dvba",
  dateStrings: "date",
});
module.exports = userdb;
