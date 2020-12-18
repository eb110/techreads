const mongoose = require('mongoose');
const Book = new mongoose.Schema({
    id:{
        type: Number
    },
    authors:[],
    title:{
        type: String
    },
    description:{
        type: String
    },
    publisher:{
        type: String
    },
    year:{
        type: String
    },
    isbn:{
        type:String
    },
    category:{
        type:String
    },
    ratings:[],
    reviews:[],
    readByUser:[]
})

module.exports = mongoose.model('Book', Book)