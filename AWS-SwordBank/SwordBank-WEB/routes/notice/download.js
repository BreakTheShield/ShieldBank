var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const url = req.query.url
    //apidownurl = "http://127.0.0.1:3001/routes/notice/download?filename=" + url 
    //res.redirect(apidownurl)          // file이 존재하는 api로 redirect 진행
    // const filename = req.query.filename;
    // const filePath = filename;
    console.log("`12131231" + url);
    res.download(url, (error) => {

        if (error) {
            console.error(error);
            res.status = statusCodes.ERROR;
            res.status.send("파일을 찾는 중에 오류가 발생했습니다.");
    }
    });
})

module.exports = router;