const express = require("express");

//Database 
const database=require("./database");
//INITIALIZATION 
const booky = express();

//Confihuration 
booky.use(express.json());



/* 
Route         /
Description   Get all books 
Access        Public
Parameter     None
Methods       get

*/
booky.get("/",(req,res)=> {
    return res.json({books:database.books});


});



/* 
Route         /
Description   Get  books based on isbn
Access        Public
Parameter     isbn
Methods       get

*/

booky.get("/is/:isbn",(req,res)=> {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN===req.params.isbn 
        );

        if(getSpecificBook.length===0)
        {
            return res.json({
                error:`No book found for the ISBN of ${req.params.isbn}`,
        });
        }
        return res.json({books: getSpecificBook});


});


/* 
Route         /c
Description   Get  books based on category
Access        Public
Parameter     category
Methods       get

*/
booky.get("/c/:category",(req,res)=> {
     
    const getSpecificBook = database.books.filter(
        (book) =>  book.category.includes(req.params.category)
        );

        if(getSpecificBook.length===0)
        {
            return res.json({
                error:`No book found for the category of ${req.params.category}`,
        });
        }
        return res.json({books: getSpecificBook});
});



/* 
Route         /lan
Description   Get  books based on language
Access        Public
Parameter     category
Methods       get

*/
booky.get("/l/:lan",(req,res)=> {
    const getSpecificBook = database.books.filter(
        (book) => book.language===req.params.lan 
        );

        if(getSpecificBook.length===0)
        {
            return res.json({
                error:`No book found for the ISBN of ${req.params.lan}`,
        });
        }
        return res.json({books: getSpecificBook});

    });



/* 
Route         /author
Description   Get All authors
Access        Public
Parameter     none
Methods       get

*/
booky.get("/a",(req,res)=> {
    return res.json({authors:database.author});
});


/* 
Route         /author
Description   Get  authors based on id 
Access        Public
Parameter     id
Methods       get

*/
booky.get("/a/:aid",(req,res)=> {
    const getSpecificAuthor = database.author.filter(
        (authors) => authors.id===req.params.aid 
        );

        if(getSpecificAuthor.length===0)
        {
            return res.json({
                error:`No Author found for the id of ${req.params.aid}`,
        });
        }
        return res.json({authors: getSpecificAuthor});


});


/* 
Route         /author/books
Description   Get  authors based on books
Access        Public
Parameter     id
Methods       get

*/
booky.get("/author/book/:isbn",(req,res)=> {
    const getSpecificAuthor = database.author.filter((author)=>
        author.books.includes(req.params.isbn)
        );

        if(getSpecificAuthor.length===0)
        {
            return res.json({
                error:`No Author found for the book of ${req.params.isbn}`,
        });
        }
        return res.json({books: getSpecificAuthor});

    });



/* 
Route         /publication
Description   Get All Publications
Access        Public
Parameter     none
Methods       get

*/
booky.get("/publications",(req,res)=> {
    return res.json({publications:database.publication});
});



/* 
Route         /author/books
Description   Get list of  publication  based on books
Access        Public
Parameter     id
Methods       get

*/
booky.get("/publications/book/:isbn",(req,res)=> {
    const getSpecificPublication = database.publication.filter((publication)=>
        publication.books.includes(req.params.isbn)
        );

        if(getSpecificPublication.length===0)
        {
            return res.json({
                error:`No publication found for the book of ${req.params.isbn}`,
        });
        }
        return res.json({books: getSpecificPublication});

    });


 /*
Route           /book/add
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/add", (req, res) => {
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books });
});



/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/add", (req, res) => {
    const { newAuthor } = req.body;
    database.author.push(newAuthor);
    return res.json({ authors: database.author });
  });


/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;
    database.publication.push(newPublication);
    return res.json({ publications: database.publication });
  });


  /*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.title = req.body.newBookTitle;
        return;
      }
    });
  
    return res.json({ books: database.books });
  });



  /*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
    // update book database
  
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        return book.author.push(parseInt(req.params.authorId));
      }
    });
    // update author database

  database.author.forEach((author) => {
    if (author.id === parseInt(req.params.authorId))
      return author.books.push(req.params.isbn);
  });

  return res.json({ books: database.books, author: database.author });
});


/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn",(req,res)=>{
  //update the publication database
  database.publication.forEach((publication) => {
    if (publication.id === req.body.pubId){
      return publication.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if (book.ISBN ===req.params.isbn)
    { 
      book.publication=req.body.pubId;
      return;
    }
  });
  
    return res.json({ 
    books: database.books, 
    publications: database.publication,
    message:"Successfully updated publication"
  });

});


/* 
Route         /book/delete
Description   Delete a book
Access        Public
Parameter     isbn
Methods       delete

*/
booky.delete("/book/delete/:isbn",(req,res)=>{
  
  //Tadeoff
  //Replace the whole object(map)
  //edit at single point to master dsatabase (foreach)

  const updatedBookDatebase =database.books.filter(
    (book) => book.ISBN!== req.params.isbn
    );
    //filter will return new array
    database.books=updatedBookDatebase;
    return res.json({books:database.books});


});

/* 
Route         /book/delete/author
Description   Delete a author from a book
Access        Public
Parameter     isbn
Methods       delete

*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{

  //Update Book Database 
  database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn)
    {
      const newAuthorList=book.author.filter(
        (author)=> author!==parseInt(req.params.authorId)
        );
        book.authors=newAuthorList;
        return; 

    }

  });
  //Update Author
  database.author.forEach((author)=> {
    if(author.id===parseInt(req.params.authorId)){
      const newBooksList =author.books.filter(
        (book)=> book!==req.params.isbn
        );
        author.books=newBooksList;
        return;
    }
  });
  return res.json({ 
    books: database.books, 
    author: database.author,
    message:"Successfully Deleted Author",
  });
  
});

booky.listen(3000,() => console.log("Server is running"))
