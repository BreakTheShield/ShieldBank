var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
const { Sequelize } = require('../../../models_board');
var statusCodes = require('../../statusCodes'); 

router.post('/', function (req, res) {          // post로 요청받은 data     

    var f_ac = req.body.from_account;
    var t_ac = req.body.to_account;
    var amount = req.body.amount;
    var sendtime = req.body.sendtime;
    var from_bankcode = 333;
    var to_bankcode = req.body.bankcode;
    var r = new Response(); 

    Model.account.findOne({          // select balance from account where account_number = f_ac;     
        where: {  
            account_number: f_ac
        },
        attributes: ["balance"]
    }).then((data) => {
        if (data.balance >= amount) {          // 출금액보다 출금 계좌 잔고가 많은 경우       
            Model.account.update({          // update account set balance = (balance - amount) where account_number = f_ac;
                balance: Sequelize.literal(`balance - ${amount}`)          // 출금 계좌에서 출금액 차감
            }, {
                where: {
                    account_number: f_ac
                }
            }).then(() => {         
                Model.account.update({          // update account set balance = (balance + amount) where account_number = t_ac;
                    balance: Sequelize.literal(`balance + ${amount}`)          // 입금 계좌에 입금액 추가
                }, {
                    where: {
                        account_number: t_ac
                    }
                }).then(() => {
                    Model.transactions.create({          // insert into transactions (from_account, to_account, amount, sendtime, from_bankcode, to_bankcode) values (from_account, to_account, amount, sendtime, from_bankcode, to_bankcode);
                        from_account: f_ac,          // B은행 transactions 테이블에 거래목록 추가
                        to_account: t_ac,
                        amount: amount,
                        sendtime: sendtime,
                        from_bankcode: from_bankcode,
                        to_bankcode: to_bankcode
                    }).then(() => {
                        r.status = statusCodes.SUCCESS;          // transactions 생성에 성공한 경우
                        r.data = {
                            "message": "송금에 성공했습니다"
                        };
                        return res.json(r);
                    });
                }).catch((err) => {
                    r.status = statusCodes.SERVER_ERROR;
                    r.data = {
                        "message": "송금에 실패했습니다."
                    };
                    return res.json(r);
                });
            });
        } 
        else {          // 출금액이 출금 계좌 잔고보다 큰 경우 
            r.status = statusCodes.SERVER_ERROR;
            r.data = {
                "message": "입력값이 계좌 잔액보다 큽니다."
            };          
            return res.json(r);        
        }
    }).catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            "message": "송금에 실패했습니다."
        };
        return res.json(r);
    });
});

module.exports = router;
