var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/*var options = {
  useMongoClient: true,
};*/

mongoose.connect('mongodb://todo:todo123@ds155961.mlab.com:55961/todo',{ useNewUrlParser: true },function(err){
  console.log(err);
});
/*process.on("uncaughtException",function(err){
  console.log(err);
});*/
//mongoose.Promise = global.Promise;
var todoSchema = new mongoose.Schema({
  item: String
});
var Todo = mongoose.model('Todo',todoSchema);

//var data = [{item: "Get Milk"},{item: "Do the job"},{item: "Eat fish"}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
  app.get('/todo',function(req,res){
    //get data from mangodb and pass it to view
    Todo.find({},function(err,data){
      if (err) throw err;
      res.render('todo',{todos: data});
    });
  });
  app.post('/todo', urlencodedParser, function(req,res){
    //get data from view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });
  app.delete('/todo/:item',function(req,res){
    //delete request from mongodb
    Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });
};
