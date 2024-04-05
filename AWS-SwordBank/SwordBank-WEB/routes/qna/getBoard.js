var db = require('../../middlewares/db');
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');

router.get('/', function (req, res, next) {          // 글 세부내용 페이지 불러오기
    var cookie = decryptEnc(req.cookies.Token);
    profile(cookie).then((data) => {
        var cookieData = data.data;

        tokenauth.authresult(req, function (aResult) {
            if (aResult == true) {          // aResult가 true일 때,
                db.query(`SELECT *
                          FROM qnas
                          WHERE id = ${req.query.id}`, function (error, results) {          // ID값을 가진 게시글 불러오기
                    if (error) {
                        throw error;
                    }
                    res.render('temp/qna/getboard', {select:"qnas",results: results, u_data: cookieData.username});          // getBoard로 랜더링
                });
            } else {          // aResult가 true가 아닐 때,
                res.render('temp/qna/alert');
            }
        });
    });
});

module.exports = router;
