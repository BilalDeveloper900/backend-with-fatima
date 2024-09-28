"use-strict";
const router = require("express")();
const { httpsCodes } = require("../constant/httpcode");
const UserManager = require("../manager/userManeger");

router.post("/", async (req, res, next) => {

    const reqObj =  req.body;

    UserManager.createUser(reqObj)
        .then(async (result) => {
            res.status(result.status).json(result);
        })
        .catch(async (error) => {
            console.log(error);
            res.send({
                error: error,
                status: httpsCodes.SERVER_ERROR_CODE,
            });
        });
});
module.exports = router;