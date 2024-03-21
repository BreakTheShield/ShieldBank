// index.js

const express = require("express"); // express module을 import한다는 의미
const ejs = require("ejs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// express server와 연결하기 전에 데이터베이스와 연결함
// 데이터베이스는 data폴더에 emp.db의 이름으로 저장됨.
// 미리 data 폴더 만들기
const db_name = path.join(__dirname, "data", "emp.db");
const db = new sqlite3.Database(db_name, err => {
  if(err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'emp.db'");
});



const sql_create = `CREATE TABLE IF NOT EXISTS emp (
  Emp_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  dept VARCHAR(100) NOT NULL,
  pNum VARCHAR(50) NOT NULL,
  account INTEGER NOT NULL,
  salary INTEGER NOT NULL
);`;

// db.run : 첫번째 파라미터로 넘어온 sql query 실행, 그리고 두번째 파라미터인 callback함수 실행함
db.run(sql_create, err => {
  if( err ) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'emp' table!");
});

  // Database seeding
  const sql_insert = `INSERT INTO emp (Emp_ID, name, dept, pNum, account, salary) VALUES
  (1, '류승호', '미래전략본부', '990909-2332332', 123537, 90000),
  (2, '박병준', '미래전략본부', '960101-1122112', 945593, 7000),
  (3, '정승환', '미래전략본부', '970311-1122332', 537833, 8000),
  (4, '이종연', '벤처투자사업부', '931101-1322112', 523787, 50000),
  (5, '김승연', '벤처투자사업부', '951201-2822112', 147587, 7000),
  (6, '이성택', '벤처투자사업부', '960821-3822112', 366985, 4000),
  (7, '이상호', '벤처투자사업부', '990221-2922112', 558769, 3000),
  (8, '김종석', '벤처투자사업부', '960111-3122112', 223457, 2500),
  (9, '박승희', '세계금융현황분석팀', '990823-1226712', 325478, 3500),
  (10, '성진희', '세계금융현황분석팀', '970101-3928112', 203507, 8000),
  (11, '김진석', '세계금융현황분석팀', '010101-4422112', 305585, 7500),
  (12, '김영민', '세계금융현황분석팀', '000301-3325647', 300475, 60000);`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 3 emp");
  });


var app = express(); // Express server의 시작
var port = process.env.PORT || 5000;


app.set("view engine", "ejs"); // ejs 엔진을 사용한다고 선언하기
// views들이 views 폴더에 저장됨을 설정
app.set("views", path.join(__dirname, "views")); // app.set("views", __dirname + "/views"); 와 동일한 의미
app.use(express.static(path.join(__dirname, "public"))); // css와 같은 static file들이 저장된 경로 설정
app.use(express.urlencoded({extended: false})); // middleware configuration

app.listen(port, function() {
  console.log("Server started (http://localhost:5000/) !");
});



app.get("/notice", (req, res) => {
  // 기본적으로 menu가 없을 때는 '안내사항'으로 설정
  const menu = req.query.menu || '안내사항';
  
  // 현재 요청 URL이 이미 menu 쿼리 매개변수를 포함하고 있는지 확인
  const currentUrlHasMenuParam = req.url.includes('menu=');

  if (!currentUrlHasMenuParam) {
    // 현재 요청 URL에 menu 쿼리 매개변수가 포함되어 있지 않다면
    // menu 쿼리 매개변수를 추가하여 리디렉션
    return res.redirect(`/notice?menu=${encodeURIComponent(menu)}`);
  }

  // 현재 요청 URL이 menu 쿼리 매개변수를 포함하고 있다면
  // 추가적인 리디렉션 없이 그대로 렌더링
  res.render("notice", { menu });
});

// 첫번째 파라미터 "/"에 전달된 HTTP GET request에 응답
app.get('/', (req, res) => {
  res.render('index');
});

app.get("/emp", (req, res) => {
  const name = "";
  const sql = "SELECT * FROM emp ORDER BY salary";
  // 1st: 실행할 쿼리
  // 2nd: 쿼리에 필요한 변수를 포함하는 배열, 이 경우에는 쿼리에 변수가 필요없어서 []값을 사용
  // 3rd: 쿼리 실행 후 부르는 callback function
  db.all(sql, [], (err, rows) => {
    if(err) {
      return console.error(err.message);
    }
    res.render("employee", {model: rows, sname: name });
  });
});

app.get("/edit/:id", (req, res)=> {
  const id = req.params.id;
  const sql = "SELECT * FROM emp WHERE Emp_ID=?";
  db.get(sql, id, (err, row)=>{
    if(err) {
      console.error(err.message);
    }
    res.render("edit", {model:row});
  });
});


app.get("/search", (req, res)=> {
  const name = req.query.name; // 검색 폼에서 입력된 이름을 가져옵니다.
  const sql = "SELECT * FROM emp WHERE name LIKE ?";
  const searchValue = '%' + name + '%'; // 부분 일치를 위해 %를 추가합니다.
  
  db.all(sql, [searchValue], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('employee', {model: rows});
    
  });
});



// Request.body에서 posted value를 받기 위해서는 middleware인 express.urlencoded()를 사용해야 한다.
// app.use()를 통해 수행할 수 있다.
app.post("/edit/:id", (req, res)=>{
  const id = req.params.id;
  const employee = [req.body.Name, req.body.Dept, id];
  const sql = "UPDATE emp SET Name=?, Dept=? WHERE (employee_ID = ?)";
  db.run(sql, employee, err=> {
    if(err) {
      console.error(err.message);
    }
    res.redirect("/emp");
  })
});

app.get("/create", (req, res)=>{
  res.render("create", {model:{} });
});


app.post("/create", (req, res)=>{
  const employee = [req.body.Name, req.body.Dept, req.body.Comments];
  const sql = "INSERT INTO emp (Name, Dept) VALUES (?, ?)";
  db.run(sql, employee, err=> {
    if(err){
      console.error(err.message);
    }
    res.redirect("/emp");
  });
});


app.get("/delete/:id", (req, res)=>{
  const id = req.params.id;
  const sql = "SELECT * FROM emp WHERE Emp_ID=?";
  db.get(sql, id, (err, row)=>{
    if(err) {
      console.error(err.message);
    }
    res.render("delete", {model: row});
  });
});

app.post("/delete/:id", (req, res)=> {
  const id = req.params.id;
  const sql = "DELETE FROM emp WHERE Emp_ID=?";
  db.run(sql, id, err =>{
    if(err) {
      console.error(err.message);
    }
    res.redirect("/emp");
  });
});
