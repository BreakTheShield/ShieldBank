const express = require("express");
const router = express.Router();
const ModelBoard = require("../../../models_board/index");
const Response = require("../../Response");
const statusCodes = require("../../statusCodes");
const { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");

router.post("/", decryptRequest, async (req, res) => {
  var r = new Response();

  let filename = req.body.filename;

  try {
    // ModelBoard.notices에서 filename에 해당하는 파일을 찾습니다.
    const foundFile = await ModelBoard.notices.findOne({
      attributes: ['filepath'], // filepath 컬럼만 선택
      where: {
        filepath: filename // filepath 컬럼에서 파일명을 찾음
      }
    });

    if (foundFile) {
      // 파일이 존재할 경우
      r.status = statusCodes.SUCCESS;
      r.message = "파일 다운로드 성공";
      r.data = {
        filepath: `/file/${foundFile.filepath}`
      };
    } else {
      // 파일이 존재하지 않을 경우
      r.status = statusCodes.ERROR;
      r.message = "파일이 존재하지 않습니다.";
    }
  } catch (error) {
    // 에러 처리
    console.error(error);
    r.status = statusCodes.ERROR;
    r.message = "파일을 찾는 중에 오류가 발생했습니다.";
  }

  res.json(encryptResponse(r)); // 암호화된 응답 전송
});


router.get("/", (req, res) => {
  const filename = req.query.filename;
  const filePath = "../file/" + filename;
  res.download(filePath, (error) => {
      if (error) {
          console.error(error);
          res.status = statusCodes.ERROR;
          res.status.send("파일을 찾는 중에 오류가 발생했습니다.");
      }
  });
});

module.exports = router;