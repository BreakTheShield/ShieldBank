var db = require("../../middlewares/db");
var {seoultime} = require("../../middlewares/seoultime");
var express = require("express");
var router = express.Router();
var tokenauth = require("./tokenauth");
var {decryptEnc,} = require("../../middlewares/crypt");
const profile = require("../../middlewares/profile");
const multer = require("multer");
const checkCookie = require("../../middlewares/checkCookie");
var request = require("request");
const fs = require("fs");

router.get("/", function (req, res, next) {
    if (req.cookies.Token) {          // 유저가 로그인을 한 경우
        var cookie = decryptEnc(req.cookies.Token);
        profile(cookie).then((data) => {
            var cookieData = data.data;
            tokenauth.admauthresult(req, function (aResult) {
                if (aResult == true) {          // 현재 로그인 한 유저가 admin인 경우
                    res.render("temp/notice/writeBoard", {select: "notices", u_data: cookieData.username});
                } else {          // 현재 로그인 한 유저가 admin이 아닌 경우
                    res.render("temp/notice/alert");
                }
            });
        });
    } else {          // 유저가 로그인을 하지 않은 경우
        res.render("temp/notice/alert");
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {          // 파일 저장 위치를 ../file 디렉토리에 저장
            console.log(req.body.fid);
            cb(null, "../file");
        },
        filename: function (req, file, cb) {          // 파일 이름을 upload한 이름 그대로 사용
            cb(null, file.originalname);
        },
    }),
});

router.post(
    "/write",
    checkCookie,
    upload.single("imgimg"), // 파일 업로드 설정
    function (req, res, next) {
        const { title, contents } = req.body;

        // 클라이언트의 쿠키를 사용하여 사용자 프로필 정보를 가져옵니다.
        const cookie = req.cookies.Token;
        profile(cookie).then((data) => {
            var userId = data.data.username;
            if (req.file) {
                // 데이터를 다른 서버로 전송
                request.post({
                    url: api_url+'/api/notice/upload/', // 변경된 API 주소
                    formData: {
                        fid: req.body.fid,
                        title: title,
                        contents: contents,
                        userId: userId,
                        file: fs.createReadStream(req.file.path),
                    },
                }, 
                function (error, response, body) {
                    if (error) {
                        throw error;
                    }
                    const filePath = req.file.path;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("파일 삭제 중 오류 발생: " + err);
                        } else {
                            console.log("파일이 성공적으로 삭제되었습니다.");
                        }
                    });
                });
            }
            // 데이터베이스에 데이터를 삽입
            db.query(
                `INSERT INTO notices
                 VALUES (NULL, '${userId}', '${title}', '${contents}', '${req.file ? req.file.originalname : "null"}', '${seoultime}', '${seoultime}')`,
                function (error, results) {
                    if (error) {
                        throw error;
                    }
                    res.redirect("../viewBoard");
                }
            );
        });
    }
);


module.exports = router;