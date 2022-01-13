var express     = require('express');
var mongoose    = require('mongoose');
var multer      = require('multer');
var path        = require('path');
var csvModel    = require('./models/csv');
var csv         = require('csvtojson');
var bodyParser  = require('body-parser');
const querystring = require('querystring');

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

var uploads = multer({storage:storage});
var db;
//connect to db
mongoose.connect('mongodb://localhost:27017/ArihantDB',function(err,client){
if(err) throw err;
console.log('connected to db');
db = client;
});

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//static folder
app.use(express.static(path.resolve(__dirname,'public')));


//default HomePage
app.get('/',(req,res)=>{
    res.send('Home Page..!');
});
//student specific
app.get('/student/:id', function (req, res) {
    var studentId = req.params.id;
    const query = req.query;
    
    // fetching specific student data from studentId 
    csvModel.findOne({StudentId : studentId},{StudentId:true,Result:true}, function(err,doc){
        if(err) throw err;
        if(doc){
            res.render('studentView',{data:doc,dataset:''});
        }
        else{
            res.send("Error in finding StudentId : "+studentId);
        }
    });
  })

//All student data which are pass/fail
app.get('/students', function (req, res) {
    const query = req.query;
    const result = query.result;
    
    // fetching all student data which are pass/fail 
    csvModel.find({Result : result}, {StudentId:true,Result:true},function(err,doc){
        if(err) throw err;
        if(doc){
            res.render('studentView',{data:'',dataset:doc});
        }
        else{
            res.send("Error in finding Student Records with result : "+result);
        }
    });
  })  

//upload page for uploading csv file 
app.get('/upload',(req,res)=>{
    csvModel.find((err,data)=>{
         if(err){
             res.send("Unable to upload csv file..!");
         }else{
              res.render('demo',{data:''});
         }
    });
});

var temp ;
app.post('/',uploads.single('csv'),(req,res)=>{
 //convert csvfile to jsonArray   
csv()
.fromFile(req.file.path)
.then((jsonObj)=>{
    for(var x=0;x<jsonObj;x++){
         temp = parseFloat(jsonObj[x].Marks1)
         jsonObj[x].Marks1 = temp;
         temp = parseFloat(jsonObj[x].Marks2)
         jsonObj[x].Marks2 = temp;
         temp = parseFloat(jsonObj[x].Marks3)
         jsonObj[x].Marks3 = temp;
         temp = parseFloat(jsonObj[x].Final)
         jsonObj[x].Final = temp;
     }
     csvModel.insertMany(jsonObj,(err,data)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
     });
   });
});

//assign port and listen server
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));