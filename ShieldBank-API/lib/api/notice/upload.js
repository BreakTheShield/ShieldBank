// 업로드할 때 rsync로 로드밸런싱 되는 ec2에 파일 동기화
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const upload = multer({
  storage: multer.diskStorage({
      destination: function (req, file, cb) {
          console.log(req.body.fid);
          cb(null, req.body.fid);
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname);
      },
  }),
});

router.get('/', (req, res) => {
  res.send('<html><body><h1>Welcome to the file upload page</h1></body></html>');
});

router.post('/', upload.single('file'), (req, res) => {
  runRsync();
  console.log(res)
});

function runRsync() {
  const rsyncCommand = 'rsync -avz -e "ssh -i ~/keypair_sword.pem" ~/AWS-SwordBank/file/* ubuntu@20.0.20.221:~/AWS-SwordBank/file';

  exec(rsyncCommand, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
}


module.exports = router;


// 로컬 코드
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const upload = multer({
//   storage: multer.diskStorage({
//       destination: function (req, file, cb) {
//           console.log(req.body.fid);
//           cb(null, req.body.fid);
//       },
//       filename: function (req, file, cb) {
//           cb(null, file.originalname);
//       },
//   }),
// });

// router.get('/', (req, res) => {
//   res.send('<html><body><h1>Welcome to the file upload page</h1></body></html>');
// });

// router.post('/', upload.single('file'), (req, res) => {
//   console.log(res)
// });

// module.exports = router;

