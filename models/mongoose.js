const mongoose = require('mongoose')

//online
const url = 'mongodb+srv://eb110:fhekjrs343Df@cluster0-rnf08.mongodb.net/TECHREADS?retryWrites=true&w=majority'
//local
//const url = 'mongodb://127.0.0.1:27017'

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology : true
}, () => {
    console.log('db connected')
})