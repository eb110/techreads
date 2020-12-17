function review(books, auth, rev, id){
    let revs = []
    let newRew = {
        reviewer: auth,
        review: rev
    }
    let l = books.length
    for(let i = 0; i < l; i++){
        if(books[i].id == id){
            books[i].reviews.push(newRew)
            revs = books[i].reviews
            break
        }
    }
    return [books, revs]
}

module.exports = review