var db = require('../../middlewares/db');
var {seoultime} = require('../../middlewares/seoultime');
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');

router.get('/', function (req, res, next) {          // QnA 댓글 작성 불러오기
    var cookie = decryptEnc(req.cookies.Token);
    profile(cookie).then((data) => {          // 쿠키 복호화 및 사용자 프로필 정보 가져오기
        var cookieData = data.data;
        tokenauth.admauthresult(req, function (aResult) {
            if (aResult == true) {          // aResult이 true면,
                db.query(`SELECT *
                          FROM qnas
                          where id = ${req.query.id}`, function (error, results) {          // ID 값으로 QnA 글 불러오기
                    if (error) {
                        throw error;
                    }
                    res.render('temp/qna/addcomment', {          // 댓글 작성을 위해 addcomment로 랜더링
                        select: "qnas",
                        u_data: cookieData.username,
                        results: results,
                        tempid: req.query.id
                    });
                });
            } else {
                res.render('temp/qna/alert');
            }
        });
    })
});

router.post('/edit', function (req, res, next) {          // 댓글 수정 페이지
    const {comment, pid} = req.body;
    db.query(`UPDATE qnas
              SET comment   = '${comment}',
                  updatedAt = '${seoultime}'
              WHERE id = ${pid}`, function (error, results) {          // ID값 기준으로 내용, 시간 수정
        if (error) {
            throw error;
        }
        res.redirect('../viewBoard');
    });

});

module.exports = router;