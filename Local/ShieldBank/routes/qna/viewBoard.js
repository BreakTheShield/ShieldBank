// const { Boards } = require('../../models');
var db = require("../../middlewares/db");
var express = require("express");
var router = express.Router();
var tokenauth = require("./tokenauth");
var {decryptEnc,} = require("../../middlewares/crypt");
const profile = require("../../middlewares/profile");

router.get("/", function (req, res, next) {          // QnA 메인페이지 불러오기
    if (!req.cookies.Token) return res.render("temp/qna/alert");          // 토큰 확인
    tokenauth.authresult(req, function (aResult) {
        if (aResult == true) {          // aResult이 true면,
            const cookie = decryptEnc(req.cookies.Token);
            profile(cookie).then((data) => {          // 쿠키 복호화 및 사용자 프로필 정보 가져오기
                if (data.data.is_admin) {          // 만약 admin이면,
                    db.query(`SELECT *
                              FROM qnas`, function (error, results) {          // DB에서 qnas에서 모든 데이터 가져오기
                        if (error) {
                            throw error;
                        }

                        var cookieData = data.data;
                        res.render("temp/qna/viewboard", {
                            select: "qnas",
                            u_data: cookieData.username,
                            results: results,
                        });

                    });
                } else {          // admin이 아니면,
                    var userId = data.data.username;
                    db.query(`SELECT *
                              FROM qnas
                              where userId = '${userId}'`, function (error, results) {          // userID가 본인 ID일 때 qnas 데이터 가져오기
                        if (error) {
                            throw error;
                        }
                        var cookieData = data.data;
                        res.render("temp/qna/viewboard", {
                            select: "qnas",
                            u_data: cookieData.username,
                            results: results,
                        });
                    });
                }
            });
        } else {
            res.render("temp/qna/alert");
        }
    });
});

module.exports = router;
