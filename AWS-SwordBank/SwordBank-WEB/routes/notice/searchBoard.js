var db = require("../../middlewares/db");
var express = require("express");
var router = express.Router();
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require("../../middlewares/profile");

router.post("/", function (req, res, next) {
    if (req.cookies.Token) {          // 쿠키에서 로그인한 정보가 있는지 확인(Token)
        var cookie = decryptEnc(req.cookies.Token);
        profile(cookie).then((data) => {
            var cookieData = data.data;          // db에서 select 문을 활용하여 검색한 제목이 포함되는 정보가 존재하는지 확인.
            db.query(`SELECT *
                      FROM notices
                      Where title LIKE '%${
                              req.body.searchTitle
                      }%'`, function (error, results) {
                if (error) {
                    throw error;
                }
                res.render("temp/notice/viewboard", {
                    select: "notices",
                    results: results,
                    u_data: cookieData.username
                });
            });
        });
    } else {          // db에서 select 문을 활용하여 검색한 제목이 포함되는 정보가 존재하는지 확인.
        db.query(`SELECT *
                  FROM notices
                  Where title LIKE '%${
                          req.body.searchTitle
                  }%'`, function (error, results) {
            if (error) {
                throw error;
            }
            res.render("temp/notice/viewboard", {select: "notices", results: results});
        });
    }
});

module.exports = router;
