var db = require('../../middlewares/db');
var {seoultime} = require("../../middlewares/seoultime");
var express = require('express');
var router = express.Router();
var tokenauth = require('./tokenauth');
var {decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');
const multer = require('multer')
const checkCookie = require("../../middlewares/checkCookie")
const fs = require('fs');

const upload = multer({          // 파일의 저장위치와 저장되는 파일이름 정보 
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, req.body.fid);
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        }
    )
});

router.get('/', function (req, res, next) {
    if (req.cookies.Token) {          // user가 로그인 한 경우
        var cookie = decryptEnc(req.cookies.Token);
        profile(cookie).then((data) => {
            var cookieData = data.data;
            tokenauth.admauthresult(req, function (aResult) {
                if (aResult == true) {          // user가 admin인 경우
                              // 선택한 글의 id를 통해서 글을 불러옴
                    db.query(`SELECT *
                              FROM notices
                              where id = ${
                                      req.query.id
                              }`, function (error, results) {
                        if (error) {
                            throw error;
                        }
                        res.render('temp/notice/editBoard', {          // 불러온 글의 정보들과 함께 editBoard 페이지로 렌더링
                            select: "notices",
                            results: results,
                            u_data: cookieData.username,
                            tempid: req.query.id
                        });
                    });
                } else {          // user가 admin이 아닌 경우
                    res.render('temp/notice/alert');
                }
            });
        });
    } else {          // user가 로그인 하지 않은 경우
        res.render('temp/notice/alert');
    }
});

router.post('/edit', checkCookie, upload.single("imgimg"), function (req, res, next) {
    let filepath = "";
    let destination = "";
    if (req.file) {          // 해당 공지사항에 업로드된 파일이 존재하는 경우
        destination = req.file.destination;
        if (destination) {          // 해당 공지사항의 경로가 존재하는 경우
            filepath = destination + "/" + req.file.filename;
        } else {          // 해당 공지사항의 경로가 존재하지 않는 경우
            filepath = req.file.filename;
        }
        const {title, contents, pid, deletepath} = req.body;
                  // update문을 활용하여 수정된 부분을 db에 저장
        db.query(`UPDATE notices
                  SET title     = '${title}',
                      content   = '${contents}',
                      filepath  = '${filepath}',
                      updatedAt = '${seoultime}'
                  WHERE id = ${pid}`, function (error, results) {
            if (error) {
                throw error;
            }
            fs.unlink(deletepath, err => {
            })
            res.redirect('../viewBoard');
        });

    } else {          // 해당 공지사항에 업로드된 파일이 존재하지 않는 경우
        filepath = null;
        destination = null;

        const {title, contents, pid} = req.body;
                  // update문을 활용하여 수정된 부분을 db에 저장
        db.query(`UPDATE notices
                  SET title     = '${title}',
                      content   = '${contents}',
                      updatedAt = '${seoultime}'
                  WHERE id = ${pid}`, function (error, results) {
            if (error) {
                throw error;
            }
            res.redirect('../viewBoard');
        });
    }
});

module.exports = router;
