$(function() {

    //GET all books
    $('#get-button').on('click', () => {
        $.ajax({
            url: '/books',
            contentType: 'application/json',
            success: (response) => {
               let tbodyEL = $('dupa')
               tbodyEL.html('')
               let ind = 0
                let wsadLista = ''
                response.books.forEach((book) => 
                {wsadLista += '<li><a href="#' + ++ind + '">' + book.title + '</a></li>'})
           
               tbodyEL.append('\
               <div id="spis">\
               <ol>\
               ' + wsadLista + '\
               <hr>\
               </ol>\
               </div>\
               ')
                ind = 0
               response.books.forEach((book) => {
                   let authorsWsad = ''
                   book.authors.forEach((author) => {authorsWsad += '<div>Author: ' + author + '</div>'})
                   let wsad = ''
                   book.ratings.forEach((rating) => {wsad += rating + ', '})
                   if(wsad.length > 0)wsad = wsad.substring(0, wsad.length - 2)
                   let revWsad = '' 
                   book.reviews.forEach((review) => {
                    wsad += 
                    '<div>Reviewer: ' + review.reviewer + '</div>\
                    <div>Review: ' + review.review + '</div>\
                    '
                 })

                tbodyEL.append('\
                <section>\
                <div class="slajd">\
                <p id="' + ++ind + '">' + ind + '.' + book.title + '</p>\
                ' + authorsWsad + '\
                \
                 <div>Description: ' + book.description + '</div>\
                 <div>Publisher: ' + book.publisher + ' Year: ' + book.year + ' ISBN: ' + book.isbn + '</div>\</div>\
                 <div>Category: ' + book.category + '</div>\
                 <div class="id">ID: ' + book.id + '</div>\
                 <div>Ratings: ' + wsad + '</div>\
                 ' + revWsad + '\
                 \
                 <hr>\
                 <form id="rewiev-form">\
                 <div><input type="textarea" id="create-review"></div>\
                 <button class="add-review-button">Add a Review</button>\
                 </form>\
                 <hr>\
                 </div>\
                 </section>\
                 ')
            })           
        }            
        })
    })

    //POST Review
    $('dupa').on('click', '.add-review-button', function(event) {
        event.preventDefault();
       let check = $(this).closest('section')
       let id = check.find('.id').text()
       let rev = check.find('#create-review')
        $.ajax({
            url: '/review',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ rev: rev.val(), id: id}),
            success: (response) => {
                console.log(response)
                rev.val('')
                $('#get-button').click()
            }
        })
    })

    //POST Search
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

  /*  
//UPDATE/PUT
$('dupa').on('click', '.add-review-button', function() {
    let rowEL = $(this).closest('section')
    console.log(rowEL)
   let wsad = rowEL.find('.create-review').val()
    console.log(wsad)
   // let id = rowEl.find('.id').text();
   // let newName = rowEl.find('.name').val();

    $.ajax({
        url: '/products/' + id,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ newName: newName }),
        success: (response) => {
            console.log(response);
            $('#get-button').click();
        }
    });
    
});
*/