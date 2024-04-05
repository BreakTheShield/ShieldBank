var db = require('../../middlewares/db');
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');
const profile = require('../../middlewares/profile');
const fs = require('fs');

router.get('/', function (req, res, next) {          
    if (req.cookies.Token) {          // user가 로그인 한 경우
        tokenauth.admauthresult(req, function (aResult) {
            if (aResult == true) {          // user가 admin인 경우
                          // 업로드된 파일에 대한 정보를 select 진행
                db.query(`SELECT filepath
                          FROM notices
                          WHERE id = ${req.query.id}`, function (error, results) {
                    if (error) {
                        throw error;
                    }
                    var fp = results[0].filepath
                              // 업로드 된 파일의 filepath를 받아서 delete 진행
                    db.query(`DELETE
                              FROM notices
                              WHERE id = ${req.query.id}`, function (error, results) {
                        if (error) {
                            throw error;
                        }
                        fs.unlink(fp, err => {
                        })
                        res.redirect('viewBoard');
                    });
                });
            } else {          // user가 admin이 아닌 경우
                res.render('temp/notice/alert');
            }
        });
    } else {          // user가 로그인 하지 않은 경우
        res.render('temp/notice/alert');
    }
});

module.exports = router;
