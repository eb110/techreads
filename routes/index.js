//uwaga zmian answer.ejs na login.ejs...w dwoch miejscach

const express = require('express')
const router = express.Router()

let bodyParser = require('body-parser');
router.use(bodyParser.json());

const methodOverride = require('method-override')
router.use(methodOverride('_method'))

const bcrypt = require('bcrypt')
const passport = require('passport')


const Book = require('../models/book')
let original_books = []
let books = []
let nazwa = {}
const User = require('../models/user')

let control_search_all = 0

const search_method = require('../search_books')
const new_review_method = require('../new_review')
const new_rating_method = require('../new_rating')
const new_read_method = require('../new_book_read')

const passwordCheck = require('../checkPassword')

//hook up passport configuration
const initializePassport = require('../passport-config')

initializePassport(
    passport,
    //this is getUserByEmail function in passport-config.js file
    async email => {
        listUsers = await User.find({})
        const check = listUsers.find(x => x.userEmail === email)
        return check
    },
    //same stuff but for getUserById
    async id => {
        listUsers = await User.find({})
        const check = listUsers.find(x => x.id === id)
        return check
    }
    //atm we have initialized our passport by user typed authentication
)

router.use(passport.initialize())
router.use(passport.session())

router.get('/', checkAuthenticated, async (req, res) => {
    nazwa = await req.user
    original_books = await Book.find({})
    original_books.forEach((book) => {
        books.push(book)
    })
    /*
    await Book.updateOne({
        id: 3
    },{
        $set: {
             readByUser: []
        }
    })
     await User.updateOne({
        userName: nazwa.userName
    },{
        $set: {
             readBooks: []
        }
    })
    await User.updateOne({
        userName: nazwa.userName
    },{
        $set: {
             interests: []
        }
    })
    */
    res.render('index.ejs', {
        nameIndex: nazwa.userName
    })
})

router.get('/user_books', checkAuthenticated, (req, res) => {
    res.send({ user: nazwa })
})
router.get('/user_interests', checkAuthenticated, (req, res) => {
    res.send({ user: nazwa })
})
router.get('/user_recommendations', checkAuthenticated, (req, res) => {
    res.send({ user: nazwa, books: original_books })
})


router.get('/books', checkAuthenticated, (req, res) => {
    if (control_search_all == 1) {
        control_search_all = 0
        res.send({ books: books, user: nazwa })
    }
    else {
        books = []
        original_books.forEach((book) => {
            books.push(book)
        })
        res.send({ books: original_books, user: nazwa })
    }
})

router.post('/search', checkAuthenticated, (req, res) => {
    control_search_all = 1
    let auth = req.body.auth
    let titl = req.body.titl
    let cath = req.body.cath
    books = search_method(original_books, auth, titl, cath)
    res.send('books has been searched')
})

router.post('/bookread', checkAuthenticated, async (req, res) => {
    control_search_all = 1
    let data = req.body.rev
    let id = +req.body.id.substring(4)
    let cat = req.body.cat.substring(10)
    let dane = new_read_method(books, nazwa.userName, data, id)
    books = dane[0]
    let tlt = ''
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            tlt = books[i].title
            break
        }
    }
    let wsad = {
        title: tlt,
        date: data
    }
    nazwa.readBooks.push(wsad)
    let userBooks = nazwa.readBooks
    userBooks.forEach((book) => { console.log(book) })
    //console.log('user books: ' + userBooks)
    await Book.updateOne({
        id: id
    }, {
        $set: {
            readByUser: dane[1]
        }
    })
    let catcheck = false
    for (let i = 0; i < nazwa.interests.length; i++) {
        if (nazwa.interests[i] === cat) {
            catcheck = true
            break
        }
    }
    console.log('categories: ' + wsad)
    await User.updateOne({
        userName: nazwa.userName
    }, {
        $set: {
            readBooks: wsad
        }
    })
    if (!catcheck) {
        nazwa.interests.push(cat)
        let wsadcat = nazwa.interests
        console.log(wsadcat)
        await User.updateOne({
            userName: nazwa.userName
        }, {
            $set: {
                interests: wsadcat
            }
        })
    }
    original_books = await Book.find({})
    res.send('book set as read')
})

router.post('/review', checkAuthenticated, async (req, res) => {
    control_search_all = 1
    let rev = req.body.rev
    let id = req.body.id.substring(4)
    if (rev !== undefined && rev.length > 0) {
        let dane = new_review_method(books, nazwa.userName, rev, id)
        books = dane[0]
        await Book.updateOne({
            id: id
        }, {
            $set: {
                reviews: dane[1]
            }
        })
        original_books = await Book.find({})
    }
    res.send('review has been added')
})

router.post('/rating', checkAuthenticated, async (req, res) => {
    control_search_all = 1
    let rev = req.body.rev
    let id = req.body.id.substring(4)
    let dane = new_rating_method(books, rev, id)
    books = dane[0]
    await Book.updateOne({
        id: id
    }, {
        $set: {
            ratings: dane[1]
        }
    })
    original_books = await Book.find({})
    res.send('rating has been added')
})

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    let password = req.body.password
    let rbn = req.body.name
    let rbe = req.body.email
    let check = passwordCheck(password)
    if (!check) {
        req.flash('error', 'Password is incorrect')
        res.redirect('/register')
    }
    else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                userName: rbn,
                userEmail: rbe,
                password: hashedPassword,
                readBooks: [],
                interests: []
            })
            await newUser.save()
            //   res.redirect('/login')  
            res.redirect('/answer')
        } catch {
            res.redirect('/register')
        }
    }
})

router.get('/login', checkNotAuthenticated, async (req, res) => {
    res.render('answer.ejs')
})

router.post('/login', passport.authenticate('local', {
    //we are going to modify it
    successRedirect: '/',
    failureRedirect: '/login',
    //we want to flash message
    failureFlash: true
}))

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})



//this will avoid the ability to visit pages without authentication
function checkAuthenticated(req, res, next) {
    //because of passport we can use isAuthenticated function
    //this function has to be applied to the routing page
    if (req.isAuthenticated()) {
        //if user logged then go next
        return next()
    }
    //if not redirect
    res.redirect('/login')
}

//function to avoid double login
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    //next just stays your browsing as it is
    next()
}

module.exports = router