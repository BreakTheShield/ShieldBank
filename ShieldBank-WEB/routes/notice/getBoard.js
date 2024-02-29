var db = require('../../middlewares/db');
var express = require('express');
var router = express.Router();
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');

router.get('/', function (req, res, next) {
    if(req.cookies.Token){          // 쿠키에서 로그인한 정보가 있는지 확인(Token)
    var cookie = decryptEnc(req.cookies.Token);
    profile(cookie).then((data) => {
        var cookieData = data.data;          // db에서 선택한 글의 id로 글의 정보를 select
        db.query(`SELECT *
                  FROM notices
                  WHERE id = '${req.query.id}'`, function (error, results) {
            if (error) {
                throw error;
            }
            var path = results[0].filepath          // filepath 재지정
            var fpp =  results[0].filepath.replace('public', '');
            
            res.render('temp/notice/getboard', {select:"notices",results: results, fpp:fpp, u_data: cookieData.username, path:path});
        });
    });
}else{          // db에서 선택한 글의 id로 글의 정보를 select
    db.query(`SELECT *
                  FROM notices
                  WHERE id = '${req.query.id}'`, function (error, results) {
            if (error) {
                throw error;
            }
            var path = results[0].filepath          // filepath 재지정
            var fpp =  results[0].filepath.replace('public', '');
            
            res.render('temp/notice/getboard', {select:"notices",results: results, fpp:fpp, path:path});
        });
}
});

module.exports = router;
