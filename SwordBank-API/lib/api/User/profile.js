var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { validateUserToken } = require("../../../middlewares/validateToken");
var { encryptResponse } = require("../../../middlewares/crypt");

/**
 * User profile route
 * This endpoint allows the user to see profile
 * @path                             - /api/user/profile
 * @middleware
 * @return                           - Status: Balance, Account number, username, is_admin
 */
router.post('/', validateUserToken, (req, res) => {
    var r = new Response();
    Model.users.findOne({          // select balance, account_number, username, is_admin, membership, is_mydata, is_loan from users where account_number = req.account_number;
        where: {
            account_number: req.account_number
        },
        attributes: ["balance", "account_number", "username", "is_admin", "membership", "is_mydata","is_loan"]
    }).then((user) => {
        if(user) {          // user가 존재하는 경우
            r.status = statusCodes.SUCCESS;
            r.data = user;
            return res.json(encryptResponse(r));          // SUCCESS를 return
        } else {          // user가 존재하는 경우
            r.status = statusCodes.NOT_AUTHORIZED;
            r.data = {
                "message": "Not authorized"
            }
            return res.json(encryptResponse(r));          // Not Authorized를 return
        }
    }).catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            "message": err.toString()
        };
        res.json(encryptResponse(r));
    });
});

module.exports = router;
