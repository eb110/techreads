$(function() {

    //GET all books
    $('#get-button').on('click', () => {
        $.ajax({
            url: '/books',
            contentType: 'application/json',
            success: (response) => {
               let tbodyEL = $('dupa')
               tbodyEL.html('')
               response.books.forEach((book) => {
                tbodyEL.append('\
                <div>ID: ' + book.id + '</div>\
                 ')
                 book.authors.forEach((author) => {
                    tbodyEL.append('\
                    <div>Author: ' + author + '</div>\
                     ')
                 })
                 tbodyEL.append('\
                 <div>Title: ' + book.title + '</div>\
                 <div>Description: ' + book.description + '</div>\
                 <div>Publisher: ' + book.publisher + '</div>\
                 <div>Year: ' + book.year + '</div>\
                 <div>ISBN: ' + book.isbn + '</div>\
                 <div>Category: ' + book.category + '</div>\
                  ')
                  let wsad = ''
                 book.ratings.forEach((rating) => {
                     wsad += rating + ', '
                 })
                 if(wsad.length > 0)wsad = wsad.substring(0, wsad.length - 2)
                 tbodyEL.append('\
                 <div>Ratings: ' + wsad + '</div>\
                 ')
                 book.reviews.forEach((review) => {
                    tbodyEL.append('\
                    <div>Reviewer: ' + review.reviewer + '</div>\
                    <div>Review: ' + review.review + '</div>\
                     ')
                 })
            })
            }
        })
    })
    

    //POST
    $('#search-form').on('submit', (event)=> {
        event.preventDefault();
    
        let auth = $('#input-author')
        let titl = $('#input-title')
        let cath = $('#input-cathegory')

        $.ajax({
            url: '/search',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ auth: auth.val(), titl: titl.val(), cath: cath.val()}),
            success: (response) => {
                console.log(response)
                auth.val('')
                titl.val('')
                cath.val('')
                $('#get-button').click()
            }
        })
    })
})