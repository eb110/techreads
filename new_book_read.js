function book_read(books, auth, dateAt, id){
    let revs = []
    let newRead = {
        name: auth,
        date: dateAt
    }
    let l = books.length
    for(let i = 0; i < l; i++){
        if(books[i].id == id){
            books[i].readByUser.push(newRead)
            revs = books[i].readByUser
            break
        }
    }
    return [books, revs, newRead.date]
}

module.exports = book_read