$(function() {

    //GET all books
    $('#get-button').on('click', () => {
        $.ajax({   
            url: '/books',
            contentType: 'application/json',
            success: (response) => {
                let user = response.user
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
               // console.log(user)
                   let bookread = ''
                   let date = ''
                   let checkIfread = false
                   for(let i = 0; i < book.readByUser.length; i++){
                       if(book.readByUser[i].name === user.userName){
                           checkIfread = true
                           date = book.readByUser[i].date
                           break
                       }
                   }
                   if(checkIfread){
                    bookread = '<div>Book read at ' + date + '</div>'
                   }
                   else bookread = 
                   '<form id="read-form">\
                        <div><input type="date" id="create-date" required value="' + new Date().toISOString().split('T')[0] + '"></div>\
                        <button class="przycisk" id="add-date-button">Book Read</button>\
                   </form>\
                   '
                   let ratave = 0
                   if(book.ratings.length != 0){
                   let temprat = book.ratings
                   ratave = temprat.reduce((sum, n) => sum + n, 0) / book.ratings.length
                   }
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
                        <div>Publisher: ' + book.publisher + ' Year: ' + book.year + ' ISBN: ' + book.isbn + '</div>\
                        <div class="cat">Category: ' + book.category + '</div>\
                        <div class="id">ID: ' + book.id + '</div>\
                        <div>Ratings Average: ' + +ratave.toFixed(2) + ' Number of Ratings: ' + book.ratings.length + '</div>\
                        <div>Ratings: ' + wsad + '</div>\
                         ' + revWsad + '\
                         \
                        <hr>\
                        <div class="contener">\
                            <div class="square">\
                                <form id="rewiev-form">\
                                    <div><input type="textarea" id="create-review"></div>\
                                    <button class="przycisk" id="add-review-button">Add Review</button>\
                                </form>\
                            </div>\
                            <div class="square">\
                                <form id="rating-form">\
                                    <div>\
                                    <select id="create-rating">\
                                    <option>1</option>\
                                    <option>2</option>\
                                    <option>3</option>\
                                    <option>4</option>\
                                    <option>5</option>\
                                    <option>6</option>\
                                    <option>7</option>\
                                    <option>8</option>\
                                    <option>9</option>\
                                    </select>\
                                    </div>\
                                    <button class="przycisk" id="add-rating-button">Add Rating</button>\
                                </form>\
                            </div>\
                            <div class="square">\
                             ' + bookread + '\
                             </div>\
                            <div style="clear:both;">\
                            <hr>\
                        </div>\
                    </div>\
                 </section>\
                 ')
            })           
        }            
        })
    })

    //POST Review
    $('dupa').on('click', '#add-review-button', function(event) {
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

        //POST Rating
        $('dupa').on('click', '#add-rating-button', function(event) {
            event.preventDefault();
           let check = $(this).closest('section')
           let id = check.find('.id').text()
           let rev = check.find('#create-rating')
            $.ajax({
                url: '/rating',
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

              //POST Book read
              $('dupa').on('click', '#add-date-button', function(event) {
                event.preventDefault();
               let check = $(this).closest('section')
               let id = check.find('.id').text()
               let cat = check.find('.cat').text()
               let rev = check.find('#create-date')
                $.ajax({
                    url: '/bookread',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ rev: rev.val(), id: id, cat: cat}),
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