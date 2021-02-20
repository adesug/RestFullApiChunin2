require('dotenv').config({})
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
// const hbs = require("handlebars");
const app = express();
const port = 8007;

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env

//konfigurasi koneksi
const conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE
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
// app.use('/assets',express.static(__dirname + '/public'));

//** VIEWS HBS */

app.get('/', (req, res) => {
  res.send({
    msg: 'Welcome to my Rest',
    status: 200,
    author: 'ADESUG'
  })
});

//route untuk homepage
app.get('/view/book',(req, res) => {
// app.get('/api/books',(req, res) => {
    // console.log(req);
    let sql = "SELECT * FROM buku";
    
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.render('buku_view',{
        results: results
      });
     
    });
});

//kategori
app.get('/view/kategori',(req, res) => {
// app.get('/api/category',(req, res) => {
  // console.log(req);
  let sql = "SELECT * FROM kategori";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('kategori_view',{
        results: results
    });  
  });
});


//getdataberdasarkan id category

// app.get('/api/category/:id',(req, res) => {
//   let sql = "SELECT * FROM kategori WHERE id_kategori="+req.params.id;
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });



//route untuk insert data
app.post('/view/save/book',(req, res) => {
    // console.log(req);
    // console.log(req.body);
    let data = {judul: req.body.judul, pengarang: req.body.pengarang, tahun_terbit: req.body.tahun_terbit};
    let sql = "INSERT INTO buku SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/view/book');
    });
  });

//kategori
app.post('/view/save/kategori',(req, res) => {
  // console.log(req);
  // console.log(req.body);
  let data = {nama_kategori: req.body.nama_kategori};
  let sql = "INSERT INTO kategori SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/view/kategori');
  });
});



//route untuk update data
app.post('/view/update/book',(req, res) => {
    // console.log(req.body);
    let sql = "UPDATE buku SET judul='"+req.body.judul+"', pengarang='"+req.body.pengarang+"', tahun_terbit='"+req.body.tahun_terbit+"'  WHERE id="+req.body.id;
    console.log(sql);
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/view/book');
    });
});

//update kategori
app.post('/view/update/kategori',(req, res) => {
  // console.log(req.body);
  let sql = "UPDATE kategori SET nama_kategori='"+req.body.nama_kategori+"' WHERE id_kategori="+req.body.id_kategori;
  // console.log(sql);
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/view/kategori');
  });
});

//route untuk delete data
app.post('/view/delete/book',(req, res) => {
    // console.log(req.body);
    let sql = "DELETE FROM buku WHERE id="+req.body.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/view/book');
    });
});

//hapus data kategori
app.post('/view/delete/kategori',(req, res) => {
  // let {id_kategori} = req.body
  // console.log(id_kategori);
  let sql = "DELETE FROM kategori WHERE id_kategori="+req.body.id_kategori+"";
  console.log("ID ",req.body.id_kategori);
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/view/kategori');
  });
});

//**RestFullAPI */

//route untuk homepage
app.get('/api/books',(req, res) => {
  // console.log(req);
  let sql = "SELECT * FROM buku";
  
  let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.json({
          msg : 'Success',
          status : 200,
          results: results
      })
  });
});

//getdataberdasarkan id buku
app.get('/api/books/:id',(req, res) => {
let sql = "SELECT * FROM buku WHERE id="+req.params.id;
let query = conn.query(sql, (err, results) => {
  if(err) throw err;
  res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
});
});

//kategori
app.get('/api/category',(req, res) => {
  // console.log(req);
  let sql = "SELECT * FROM kategori";
  let query = conn.query(sql, (err, results) => {
      if(err) throw err;  
      res.json({
          msg : 'Success',
          status : 200,
          results: results
      });
  });
});

app.get('/api/category/:id',(req, res) => {
  let sql = "SELECT * FROM kategori WHERE id_kategori="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//route untuk insert data
app.post('/api/books',(req, res) => {
  // console.log(req);
  // console.log(req.body);
  let data = {judul: req.body.judul, pengarang: req.body.pengarang, tahun_terbit: req.body.tahun_terbit};
  let sql = "INSERT INTO buku SET ?";
  let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.json({
          msg: 'Tambah data berhasil',
          status : 200
      });
  });
});

//kategori
app.post('/api/category',(req, res) => {
  // console.log(req);
  // console.log(req.body);
  let data = {nama_kategori: req.body.nama_kategori};
  let sql = "INSERT INTO kategori SET ?";
  let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.json({
          msg: 'Tambah data berhasil',
          status : 200
      });
  });
});

//route untuk update data
app.put('/api/books/:id',(req, res) => {
  // console.log(req.body);
  let sql = "UPDATE buku SET judul='"+req.body.judul+"', pengarang='"+req.body.pengarang+"', tahun_terbit='"+req.body.tahun_terbit+"'  WHERE id="+req.body.id;
  console.log(sql);
  let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      
      res.json({
      msg: 'Update data berhasil',
      status : 200
      });
  });
});  

//update kategori
app.put('/api/category/:id',(req, res) => {
  // console.log(req.body);
  let sql = "UPDATE kategori SET nama_kategori='"+req.body.nama_kategori+"' WHERE id_kategori="+req.body.id_kategori;
  // console.log(sql);
      let query = conn.query(sql, (err, results) => {
          if(err) throw err;
          res.json({
          msg: 'Update data berhasil',
          status : 200
      });
  });
});

//route untuk delete data
app.delete('/api/books/:id',(req, res) => {
  // console.log(req.body);
  let sql = "DELETE FROM buku WHERE id="+req.body.id+"";
  let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.json({
          msg: 'Hapus data berhasil',
          status : 200
      });
  });
});

//hapus data kategori
app.delete('/api/category/:id',(req, res) => {
  // console.log(req.body);
  let sql = "DELETE FROM kategori WHERE id_kategori="+req.body.id_kategori+"";
  let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.json({
          msg: 'Hapus data berhasil',
          status : 200
      });
  });
});


//server listening
app.listen(port, () => {
    console.log('Server is running at port 8000');
});
   