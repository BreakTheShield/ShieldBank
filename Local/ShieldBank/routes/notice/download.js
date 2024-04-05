var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const url = req.query.url
    apidownurl = "http://127.0.0.1:3000/api/notice/download?filename=" + url 
    res.redirect(apidownurl)          // file이 존재하는 api로 redirect 진행
})

module.exports = router;