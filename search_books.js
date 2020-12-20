function search(books, auth, titl, cath){
    auth = auth.toLowerCase()
    titl = titl.toLowerCase()
    cath = cath.toLowerCase()
    if(auth.length == 0)auth = 'zzz'
    if(titl.length == 0)titl = 'zzz'
    if(cath.length == 0)cath = 'zzz'
    let temp_books = []
    for(let i = 0; i < books.length; i++){
        let flag = 0
        for(let j = 0; j < books[i].authors.length; j++){
            if(books[i].authors[j].toLowerCase().includes(auth)){
                temp_books.push(books[i])
                flag = 1
                break
            }
        }
        if(flag == 1)continue
        if(books[i].category.toLowerCase().includes(cath) || books[i].title.toLowerCase().includes(titl))
            temp_books.push(books[i])
    }
     return temp_books   
}

module.exports = search