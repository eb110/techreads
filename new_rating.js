function rating(books, rev, id){
    let l = books.length
    let revs = []
    for(let i = 0; i < l; i++){
        if(books[i].id == id){
            books[i].ratings.push(+rev)
            revs = books[i].ratings
            break
        }
    }
    return [books, revs]
}

module.exports = rating