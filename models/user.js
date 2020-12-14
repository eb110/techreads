
/*we have to initiate mongoose as we are going to use
its method 'model'*/
const mongoose = require('mongoose')
//model
const User = new mongoose.Schema({
    userName:{
        type: String,
    },
    password: {
        type: String,
    },
    readBooks:[],
    interests: []
})

/*we have to export our function as 
we want to use it*/

module.exports = mongoose.model('User', User)