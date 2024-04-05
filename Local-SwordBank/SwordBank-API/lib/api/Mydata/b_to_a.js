var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
const Sequelize = require("sequelize");
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");
const axios = require('axios');
const apiUrl = 'http://127.0.0.1:3000/api/mydata/send_btoa';

/**
 * Balance transfer route
 * @path                 - /api/balance/transfer
 * @middleware
 * @param to_account     - Amount to be transferred to this account
 * @param amount         - Amount to be transferred
 * @return               - Status
 */
router.post('/', [validateUserToken, decryptRequest], (req, res) => {          // B은행 계좌에서 A은행 계좌로 송금하는 경우
    var r = new Response();
    let from_account = req.body.from_account;
    let to_account = req.body.to_account;
    let bank_code = req.body.bank_code;
    let amount = req.body.amount;
    let sendtime = req.body.sendtime;
    let username = req.username;

    if (amount < 0) {          // 출금 금액이 0원보다 적은 경우
        r.status = statusCodes.BAD_INPUT;
        r.data = {
            "message": "입력 값을 0원 이상 입력해주세요."
        };
        return res.json(encryptResponse(r));
    } else {          // 출금 금액이 0원 이상인 경우
        axios({          // B은행에서 이체를 진행하기 위한 API로 req
            method: "post",
            url: apiUrl,
            data: { from_account: from_account, amount: amount, bank_code: bank_code, to_account: to_account, sendtime: sendtime, username: username }
        }).then((data) =>{
            
            if (data.data.status.code == 200) {          // B은행 계좌에서 정상적으로 출금에 성공한 경우
                Model.account.update({          // update account set balance = (balance + amount) where account_number = to_account;
                    balance: Sequelize.literal(`balance + ${amount}`)          // A은행 계좌에 송금금액 추가
                }, {
                    where: {
                        account_number: to_account
                    }
                }).then(() => {
                    Model.transactions.create({          // insert into transactions (from_account, to_account, amount, sendtime, from_bankcode, to_bankcode) values (from_account, to_account, amount, sendtime, 333, to_bankcode);      
                        from_account: from_account,          // A은행 transactions 테이블에 거래목록 추가
                        to_account: to_account,
                        amount: amount,
                        sendtime: sendtime,
                        from_bankcode: 333,
                        to_bankcode: bank_code
                    }).then(() => {
                        r.status = statusCodes.SUCCESS;
                        r.data = {
                            "message": "송금에 성공했습니다."
                        };
                        return res.json(encryptResponse(r));
                    })
                }).catch((err) => {
                    r.status = statusCodes.SERVER_ERROR;
                    r.data = {
                        "message": "송금에 실패했습니다."
                    };
                    return res.json(encryptResponse(r));
                })
            } else {          // B은행 계좌에서 출금이 이뤄지지 않은 경우
                r.status = statusCodes.BAD_INPUT;
                r.data = {
                    "message": "계좌의 잔액이 부족합니다."
                };
                return res.json(encryptResponse(r));        
            }
        }).catch((err) => {
            r.status = statusCodes.SERVER_ERROR;
            r.data = {
                "message": "송금에 실패했습니다."
            };
            return res.json(encryptResponse(r));
        })
    }
})

module.exports = router;
