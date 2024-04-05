var express = require('express');
var router = express.Router();
const axios = require("axios");
const profile = require("../../middlewares/profile")
const {decryptRequest, encryptResponse} = require("../../middlewares/crypt")
const checkCookie = require("../../middlewares/checkCookie")
var {seoultime} = require('../../middlewares/seoultime');

router.get("/", checkCookie, async (req, res) => {          // 송금 기본 페이지 불러오기
    const cookie = req.cookies.Token;
    
    profile(cookie).then((data) => {
        axios({          // 송금 페이지를 위한 api로 req 
            method: "post",
            url: api_url + "/api/beneficiary/account",
            headers: {"authorization": "1 " + cookie},
            data:{username:data.data.username}
        }).then((data2) => {
            var d = decryptRequest((data2.data));
            var results = d.data.accountdata;
            var html_data = `
                <input type="text" class="form-control form-control-user" autocomplete="off" id="drop_from" name="from_account" placeholder="보내는 계좌번호" list="dropdown_from">
                <datalist id="dropdown_from">`;
            results.forEach(function (a) {
                html_data += `<option value="${a}"></option>`;
            });

            html_data += `</datalist><br>`;

            html_data += `<input type="text" class="form-control form-control-user mb-3"id="to_account" name="to_account" placeholder="대상 계좌번호" > `
            res.render("Banking/trade_send", {pending: data, html: html_data, select: "send"});
        });
    });
});

router.post("/post", checkCookie, function (req, res, next) {          // 송금 요청
    const cookie = req.cookies.Token;
    let json_data = {};
    let result = {};

    json_data['from_account'] = parseInt(req.body.from_account);
    json_data['to_account'] = parseInt(req.body.to_account);   //데이터가 숫자로 들어가야 동작함
    json_data['amount'] = parseInt(req.body.amount);
    json_data['sendtime'] = seoultime;

    const en_data = encryptResponse(JSON.stringify(json_data));// 객체를 문자열로 반환 후 암호화
    axios({          // 송금을 위한 api로 req
        method: "post",
        url: api_url + "/api/balance/transfer",
        headers: {"authorization": "1 " + cookie},
        data: en_data
    }).then((data) => {
        result = decryptRequest(data.data);
        statusCode = result.data.status;
        message = result.data.message;

        if(statusCode != 200) {          // 성공하면, 성공 메시지
            res.send(`<script>
            alert("${message}");
            location.href=\"/bank/send\";
            </script>`);
        } else {          // 실패하면, 실패 메시지
            res.send(`<script>
            alert("${message}");
            location.href=\"/bank/list\";
            </script>`);
        }
    });
});

module.exports = router;