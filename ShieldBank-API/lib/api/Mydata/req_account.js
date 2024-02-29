var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { validateNumberToken } = require("../../../middlewares/validateToken");
var { encryptResponse, } = require("../../../middlewares/crypt");

const axios = require('axios');

const apiUrl = 'http://192.168.10.131:3000/api/mydata/res_account';
/**
 * Beneficiary approve route
 * This endpoint allows to view is_loan of any user
 * @path                             - /api/mydata/req_account
 * @middleware                       - Checks admin authorization
 * @return                           - Status
 */
router.post('/', validateNumberToken, (req, res) => {          // mydata에서 B은행 계좌 요청받음
    var r = new Response();
    let req_phone = req.phone;

    axios({          // B은행에 해당 user의 계좌정보를 요청
        method:"post",
        url: apiUrl,
        data: { phone: req_phone }
    }).then(data => {
        r.data = data.data.data2;
        return res.json(encryptResponse(r));          // B은행에서 받아온 user의 계좌 정보들을 return
    })
    .catch(error => {
        return res.json(encryptResponse(r));
    });
});


module.exports = router;