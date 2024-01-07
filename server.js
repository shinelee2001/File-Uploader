const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const UPLOAD_PATH = 'uploads/';
const storage = multer.diskStorage({
  // diskStorage 객체 생성
  destination: (req, file, cb) => cb(null, UPLOAD_PATH), // 파일이 저장될 폴더
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    ),
});

const upload = multer({ storage }); // storage 객체를 multer로 전달

const app = express();

// handle errer: 에러 처리 미들웨어 함수 정의시 4개의 매개변수가 필요하다.
// app.use(function(error, request object, response object, next function) {callback function for handling error})
app.use((err, req, res, next) => {
  res.status(500).send('Failed to upload');
});

// routes callback function to '/' path for GET request
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/index.html')); // 응답 결과는 res.sendFile 함수를 통해 index.html 파일을 전달. 따라서 '/'경로 호출 시 index.html에 작성된 HTML 페이지가 브라우저에 출력됨.
});

// routes callback function to '/upload' path for POST request
// cors 모듈에 이어서 multipart로 전달된 file의 업로드 관련 설정 지정.
app.post('/upload', cors(), upload.single('file'), (req, res, next) => {
  if (!req.file) return next(400); // if no file received, returns error code 400. This code transfers to error handling case on line 28.
  res.status(200).send('Uploaded successfully');
});

// routes callback fucntion to '/file_list' path for GET request
app.get('/file_list', cors(), (req, res, next) => {
  fs.readdir(path.join(__dirname, UPLOAD_PATH), (err, files) => {
    if (err) return next(err);
    res.status(200).send(files);
  });
});

// app.listen returns http.Server object.
app.listen(3003, () => console.log(`Listening on port 3003`));
