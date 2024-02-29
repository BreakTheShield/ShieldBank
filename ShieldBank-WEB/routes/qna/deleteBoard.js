var db = require('../../middlewares/db');
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');

router.get('/', function (req, res, next) {          // 삭제 페이지 불러오기

    tokenauth.authresult(req, function (aResult) {
        if (aResult === true) {          // aResult가 true면

            db.query(`DELETE
                      FROM qnas
                      WHERE id = ${req.query.id}`, function (error, results) {          // ID값을 가진 QnA글 삭제
                if (error) {
                    throw error;
                }
                res.redirect('viewBoard');
            });
        } else {
            res.render('temp/qna/alert');
        }
    });
});

module.exports = router;
