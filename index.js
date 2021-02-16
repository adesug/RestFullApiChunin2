const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
// const hbs = require("handlebars");
const app = express();


//konfigurasi koneksi
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'databuku'
  });

  //connect ke database
conn.connect((err) =>{
    if(err) throw err;
    console.log('DB TERKONEKSI');
  });

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use('/assets',express.static(__dirname + '/public'));

//route untuk homepage
app.get('/',(req, res) => {
    console.log(req);
    let sql = "SELECT * FROM buku";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.render('buku_view',{
        results: results
      });
    // res.json({
    //     msg : 'Success',
    //     status : 200,
    //     results: results
    // })
    });
  });

//route untuk insert data
app.post('/save',(req, res) => {
    // console.log(req);
    // console.log(req.body);
    let data = {judul: req.body.judul, pengarang: req.body.pengarang, tahun_terbit: req.body.tahun_terbit};
    let sql = "INSERT INTO buku SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    // res.json({
    //     msg: 'Tambah data berhasil',
    //     status : 200
    // })
    });
  });

//route untuk update data
app.post('/update',(req, res) => {
    // console.log(req.body);
    let sql = "UPDATE buku SET judul='"+req.body.judul+"', pengarang='"+req.body.pengarang+"', tahun_terbit='"+req.body.tahun_terbit+"'  WHERE id="+req.body.id;
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });

//route untuk delete data
app.post('/delete',(req, res) => {
    
    // console.log(req.body);
    let sql = "DELETE FROM buku WHERE id="+req.body.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });

//server listening
app.listen(8000, () => {
    console.log('Server is running at port 8000');
  });
   