var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
const Sequelize = require("sequelize");
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");

const axios = require('axios');
const apiUrl = 'http://192.168.10.130:3000/api/mydata/send_btob';

/**
 * Balance transfer route
 * @path                 - /api/balance/transfer
 * @middleware
 * @param to_account     - Amount to be transferred to this account
 * @param amount         - Amount to be transferred
 * @return               - Status
 */
router.post('/', [validateUserToken, decryptRequest], (req, res) => {          // B은행 계좌에서 B은행 계좌로 송금하는 경우
    var r = new Response();
    let from_account = req.body.from_account;
    let to_account = req.body.to_account;
    let bank_code = req.body.bank_code;
    let amount = req.body.amount;   
    let sendtime = req.body.sendtime;
    let username = req.username;
    if (amount < 0) {          // 출금 금액이 0원보다 적은 경우
        r.status = statusCodes.SUCCESS;
        r.data = {
            "message": "입력 값을 0원 이상 입력해주세요."
        };
        return res.json(encryptResponse(r));
    }
    
    axios({          // B은행에서 송금을 하기위한 API req
        method: "post",
        url: apiUrl,
        data: { from_account: from_account, amount: amount, bankcode: bank_code, to_account: to_account, sendtime: sendtime } 
    }).then((data) => {
        if (data.data.status.code == 200) {          // 송금이 정상적으로 이뤄진 경우
            r.data = {
                "message": data.data.data.message
            };
            return res.json(encryptResponse(r));
        }
        else {          // 송금이 정상적으로 이뤄지지 않은 경우
            r.data = {
                "message": data.data.data.message
            };
            return res.json(encryptResponse(r));
        }
    }).catch(err => {
        r.data = {
            "message": "송금에 실패했습니다."
        };
        return res.json(encryptResponse(r));
        });
}); 



module.exports = router;