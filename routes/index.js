  
const express = require('express')
const router = express.Router()

let bodyParser = require('body-parser');
router.use(bodyParser.json());

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
    res.render('index.ejs', {
        nameIndex: nazwa.userName
    })
})

router.get('/books', (req, res) => {
    if(control_search_all == 1){
        control_search_all = 0
    res.send({books: books})
    }
    else 
    res.send({books: original_books})
})

router.post('/search', (req, res) => {
    control_search_all = 1
    let auth = req.body.auth
    let titl = req.body.titl
    let cath = req.body.cath
    books = search_method(original_books, auth, titl, cath)
    res.send('books has been searched')
})

router.post('/review', async (req, res) => {
   let rev = req.body.rev
   let id = req.body.id.substring(4)
   let dane = new_review_method(original_books, nazwa.userName, rev, id)
   original_books = dane[0]
   books = original_books
   await Book.updateOne({
       id: id
   },{
       $set: {
            reviews: dane[1]
       }
   })
    res.send('review has been added')
})

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
    })

router.post('/register', checkNotAuthenticated, async (req, res) => {
        let password = req.body.password
        let rbn = req.body.name
        let rbe = req.body.email
        try{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                userName: rbn,
                userEmail: rbe,
                password: hashedPassword,
                readBooks: [],
                interests: []
            })
            await newUser.save()
            res.redirect('/login')           
        } catch {
            res.redirect('/register')
        }})

router.get('/login', checkNotAuthenticated, async (req, res) => {
            res.render('login.ejs')
        })

router.post('/login', passport.authenticate('local', {
            //we are going to modify it
            successRedirect: '/',
            failureRedirect: '/login',
            //we want to flash message
            failureFlash: true
        }))



//this will avoid the ability to visit pages without authentication
function checkAuthenticated(req, res, next){
    //because of passport we can use isAuthenticated function
    //this function has to be applied to the routing page
    if(req.isAuthenticated()) {
        //if user logged then go next
        return next()
    }
    //if not redirect
    res.redirect('/login')
    }
    
    //function to avoid double login
    function checkNotAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return res.redirect('/')
        }
        //next just stays your browsing as it is
        next()
    }

module.exports = router