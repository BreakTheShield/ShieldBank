var express = require('express');
var router = express.Router();
var db = require('../../middlewares/db');

const axios = require("axios");
const {decryptRequest, decryptEnc} = require("../../middlewares/crypt");
const imageToBase64 = require("image-to-base64");
const profile = require("../../middlewares/profile")

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.render("main");
// });
router.get('/', function (req, res, next) {
    db.query(`SELECT *
              FROM notices
              ORDER BY id DESC`, function (error, results) {

        if (error) {
            throw error;
        }

        if (req.cookies.Token) {
            const cookie = decryptEnc(req.cookies.Token);
            axios({
                method: "post",
                url: api_url + "/api/User/profile",
                headers: {"authorization": "1 " + cookie}
            }).then((data) => {
                const result = decryptRequest(data.data);
                imageToBase64("http://127.0.0.1:3001/img/info3.png").then(response => {
                    html = `<img src="data:image/png;base64,${response}"/>`

                    return res.render("temp/index", {
                        select: "home",
                        select2: "info",
                        u_data: result.data.username,
                        results: results,
                        html: html
                    })
                }).catch(error => {
                    html = `<div>${error}</div>`

                    return res.render("temp/index", {
                        select: "home",
                        select2: "info",
                        u_data: result.data.username,
                        results: results,
                        html: html
                    })
                })
            });
        } else {
            imageToBase64("http://127.0.0.1:3001/img/info3.png").then(response => {
                html = `<img src="data:image/png;base64,${response}"/>`

                return res.render("temp/index", {select: "home", select2: "info", results: results, html: html})
            }).catch(error => {
                html = `<div>${error}</div>`

                return res.render("temp/index", {select: "home", select2: "info", results: results, html: html})
            })
        }
    });
});

router.post("/", (req, res) => {
    let html = ""
    const src = req.body.src;
    const select2 = req.body.select2

    db.query(`SELECT *
              FROM notices
              ORDER BY id DESC`, function (error, results) {

        if (error) {
            throw error;
        }

        if (req.cookies.Token) {
            const cookie = decryptEnc(req.cookies.Token);
            profile(cookie).then((data) => {
                const u_data = data.data.username

                imageToBase64(src).then(response => {
                    html = `<img src="data:image/png;base64,${response}"/>`
                    return res.render("temp/index", {
                        select: "home",
                        select2: `${select2}`,
                        u_data: u_data,
                        results: results,
                        html: html
                    })
                }).catch(error => {
                    html = `<div>${error}</div>`
                    return res.render("temp/index", {
                        select: "home",
                        select2: `${select2}`,
                        u_data: u_data,
                        results: results,
                        html: html
                    })
                })
            })
        } else {
            imageToBase64(src).then(response => {
                html = `<img src="data:image/png;base64,${response}"/>`
                return res.render("temp/index", {select: "home", select2: `${select2}`, results: results, html: html})
            }).catch(error => {
                html = `<div>${error}</div>`
                return res.render("temp/index", {select: "home", select2: `${select2}`, results: results, html: html})
            })
        }
    });
})

module.exports = router;
