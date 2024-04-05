var db = require('../../middlewares/db');
var {seoultime} = require("../../middlewares/seoultime");
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');

router.get('/', function (req, res, next) {          // QnA글 수정 페이지 불러오기
    var cookie = decryptEnc(req.cookies.Token);
    profile(cookie).then((data) => {
        var cookieData = data.data;
        tokenauth.authresult(req, function (aResult) {
            if (aResult == true) {          // aResult가 true일 때,
                db.query(`SELECT *
                          FROM qnas
                          where id = ${req.query.id}`, function (error, results) {          // ID값을 가진 QnA 글 가져오기
                    if (error) {
                        throw error;
                    }
                    res.render('temp/qna/editBoard', {          // 글 수정페이지로 랜더링
                        select: "qnas",
                        u_data: cookieData.username,
                        results: results,
                        tempid: req.query.id
                    });
                });
            } else {          // aResult이 true가 아니면, 
                res.render('temp/qna/alert');
            }
        });
    })
});

router.post('/edit', function (req, res, next) {          // editBoard에서 /edit form 실행 시
    const {title, contents, pid} = req.body;
    db.query(`UPDATE qnas
              SET title     = '${title}',
                  content   = '${contents}',
                  updatedAt = '${seoultime}'
              WHERE id = ${pid}`, function (error, results) {          // 제목, 내용, 업데이트시간 수정
        if (error) {
            throw error;
        }
        res.redirect('../viewBoard');
    });

});

module.exports = router;