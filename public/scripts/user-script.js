$(function(){

    //Get user books
    $('#reading-history').on('click', () => {
        $.ajax({
            url: '/user_books',
            contentType: 'application/json',
            success: (response) => {
                let UserContent = $('dupa')
                UserContent.html('')
                let counter = 1
                response.user.readBooks.forEach((book) => {
                    UserContent.append('\
                    <div>' + counter++ + '.' + book.title + '</div>\
                    <div>Read at: ' + book.date + '</div>\
                    <hr>\
                    ')
                })             
            }
        })
    })

        //Get interests
        $('#interest-history').on('click', () => {
            $.ajax({
                url: '/user_interests',
                contentType: 'application/json',
                success: (response) => {
                    let UserContent = $('dupa')
                    UserContent.html('')
                    let counter = 1
                    response.user.interests.forEach((interest) => {
                        UserContent.append('\
                        <div>' + counter++ + '.' + interest + '</div>\
                        <hr>\
                        ')
                    })             
                }
            })
        })

              //Get reccomended books
              $('#recommended-books').on('click', () => {
                $.ajax({
                    url: '/user_recommendations',
                    contentType: 'application/json',
                    success: (response) => {
                        let UserContent = $('dupa')
                        UserContent.html('')
                        let counter = 1
                        response.user.interests.forEach((interest) => {
                            response.books.forEach((book) => {
                                if(interest === book.category){
                                    UserContent.append('\
                                    <div>' + counter++ + '.' + book.title + '</div>\
                                    <div>Category: ' + interest + '</div>\
                                    <hr>\
                                    ')
                                }
                            })
                           
                        })             
                    }
                })
            })
})