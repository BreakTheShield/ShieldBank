// const { Boards } = require('../../models');
var db = require('../../middlewares/db');
var {seoultime} = require("../../middlewares/seoultime");
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');

router.get('/', function (req, res, next) {          // QnA 작성하는 페이지 불러오기
    var cookie = decryptEnc(req.cookies.Token);
    profile(cookie).then((data) => {
        var cookieData = data.data;
        tokenauth.authresult(req, function (aResult) {
            if (aResult == true) {          // aResult가 true면,
                res.render('temp/qna/writeBoard', {select:"qnas",u_data: cookieData.username});          // QnA 글 작성 페이지로 랜더링
            } else {          // aResult가 아니면,
                res.render('temp/qna/alert');
            }
        });
    });
});

router.post('/write', function (req, res, next) {          // /writeBoard에서 /qna/writeBoard/write form을 실행하면,
    var cookie = decryptEnc(req.cookies.Token);
    const {title, contents} = req.body;
    profile(cookie).then((data) => {
        var userId = data.data.username;
        db.query(`INSERT INTO qnas
                  VALUES (NULL, '${userId}', '${title}', '${contents}', '${seoultime}', '${seoultime}', NULL)`, function (error, results) {          // 게시글 작성
            if (error) {
                throw error;
            }
            res.redirect('../viewBoard');
        });
    });
});

module.exports = router;