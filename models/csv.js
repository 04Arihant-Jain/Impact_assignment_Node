var mongoose  =  require('mongoose');

var csvSchema = new mongoose.Schema({
    Name:{
        type:String
    },
    Age:{
        type:String
    },
    StudentId:{
        type:Number
    },
    Marks1:{
        type:Number
    },
    Marks2:{
        type:Number
    },
    Marks3:{
        type:Number
    },
    Final:{
        type:Number
    },
    Result:{
        type:String
    }
});

module.exports = mongoose.model('studentsrecords',csvSchema);