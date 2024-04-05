var db = require("../../middlewares/db");
var express = require("express");
var router = express.Router();
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require("../../middlewares/profile");

router.get("/", function (req, res, next) {
    if (req.cookies.Token) {          // 쿠키에서 로그인한 정보가 있는 경우
        const cookie = decryptEnc(req.cookies.Token);
        profile(cookie).then((data) => {
            var cookieData = data.data;          // 존재하는 모든 공지사항 글들을 불러오는 쿼리
            db.query(`SELECT *
                      FROM notices
                      ORDER BY id DESC`, function (error, results) {
                if (error) {
                    throw error;
                }
                res.render("temp/notice/viewboard", {          // 존재하는 모든 공지사항 글들을 렌더링
                    select: "notices",
                    results: results,
                    u_data: cookieData.username
                });
            });
        });
    } else {          // 쿠키에서 로그인한 정보가 없는 경우
        db.query(`SELECT *
                  FROM notices`, function (error, results) {
            if (error) {
                throw error;
            }
            res.render("temp/notice/viewboard", {          // 존재하는 모든 공지사항 글들을 렌더링
                select: "notices",
                results: results
            });
        });
    }
});

module.exports = router;
