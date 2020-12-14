const express = require('express')
const app = express()
const flash = require('express-flash')

const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const store1 = new MongoDBStore({
    uri : 'mongodb+srv://eb110:fhekjrs343Df@cluster0-rnf08.mongodb.net/TECHREADS?retryWrites=true&w=majority',
    collection: 'mySessions'
})
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    store: store1,
    resave: false,
    rolling: true,
    saveUninitialized: false,
}))

require('./models/mongoose')
const indexRouter = require('./routes/index')

app.use(express.urlencoded({ extended: false}))
app.use(flash())

app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname))

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log('oh yeah, the server is running')
})





//initial db creation
/*
const Book = require('./models/book')
async function dbSave(po) {
    const newBook = await new Book({
      id: po.id,
      authors: po.authors,
      title: po.title,
      description: po.description,
      publisher: po.publisher,
      year: po.year,
      isbn: po.isbn,
      category: po.category,
      ratings: po.ratings,
      reviews: po.reviews
    })
    await newBook.save()
}

let test = require('./test.json')
for(let i = 0; i < test.length; i++){
    let test2 = JSON.stringify(test[i])
    let pok = JSON.parse(test2)
    dbSave(pok)
}
*/