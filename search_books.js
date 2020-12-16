const book = require("./models/book")

function search(books, auth, titl, cath){
    let temp_books = []
    let flag = 0
    for(let i = 0; i < books.length; i++){
        let flag = 0
        for(let j = 0; j < books[i].authors.length; j++){
            if(books[i].authors[j] === auth){
                temp_books.push(books[i])
                flag = 1
                break
            }
        }

        if(flag == 1)continue
        if(books[i].category === cath || books[i].title === titl)
            temp_books.push(books[i])
    }
     return temp_books   
}

module.exports = search