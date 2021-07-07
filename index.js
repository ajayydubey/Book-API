require('dotenv').config(); 

//Framework
const express = require("express");
const mongoose = require('mongoose');


//Database 
const database = require("./database");

//MODEL 
const BookModel =require("./Database/book");
const AuthorModel = require("./Database/author");
const PublicationModel =require("./Database/publication");

//INITIALING EXPRESS 
const booky = express();


//Confihuration 
booky.use(express.json());

//Establish a connection
mongoose.connect(process.env.MONGO_URL, 
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection is established"));




/* 
Route         /
Description   Get all books 
Access        Public
Parameter     None
Methods       get
*/
booky.get("/", async(req, res) => {
  const getAllBooks=await BookModel.find();
  return res.json({ books: database.books });
});




/* 
Route         /
Description   Get  books based on isbn
Access        Public
Parameter     isbn
Methods       get

*/
booky.get("/is/:isbn", async(req, res) => {
  const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn})

  // const getSpecificBook = database.books.filter(
  //   (book) => book.ISBN === req.params.isbn
  // );


  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }
  return res.json({ books: getSpecificBook });


});


/* 
Route         /c
Description   Get  books based on category
Access        Public
Parameter     category
Methods       get

*/
booky.get("/c/:category", async(req, res) => {
  const getSpecificBook = await BookModel.findOne({category :req.params.category })
  // const getSpecificBook = database.books.filter(
  //   (book) => book.category.includes(req.params.category)
  // );

  if (! getSpecificBook) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }
  return res.json({ books: getSpecificBook });
});



/* 
Route         /lan
Description   Get  books based on language
Access        Public
Parameter     category
Methods       get

*/
booky.get("/l/:lan", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.lan
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.lan}`,
    });
  }
  return res.json({ books: getSpecificBook });

});



/* 
Route         /author
Description   Get All authors
Access        Public
Parameter     none
Methods       get

*/
booky.get("/author", async(req, res) => {
  const getAllAuthors =await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});


/* 
Route         /author/aid
Description   Get  authors based on id 
Access        Public
Parameter     id
Methods       get

*/
booky.get("/author/:aid", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (authors) => authors.id === req.params.aid
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the id of ${req.params.aid}`,
    });
  }
  return res.json({ authors: getSpecificAuthor });


});


/* 
Route         /author/books
Description   Get  authors based on books
Access        Public
Parameter     id
Methods       get

*/
booky.get("/author/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.isbn}`,
    });
  }
  return res.json({ books: getSpecificAuthor });

});



/* 
Route         /publication
Description   Get All Publications
Access        Public
Parameter     none
Methods       get

*/
booky.get("/publications", (req, res) => {
  return res.json({ publications: database.publication });
});



/* 
Route         /author/books
Description   Get list of  publication  based on books
Access        Public
Parameter     id
Methods       get

*/
booky.get("/publications/book/:isbn", (req, res) => {
  const getSpecificPublication = database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn)
  );

  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No publication found for the book of ${req.params.isbn}`,
    });
  }
  return res.json({ books: getSpecificPublication });

});


/*
Route           /book/add
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/add",(req, res) => {
   
  const { newBook } = req.body;
  const  addNewBook =BookModel.create(newBook);

  // database.books.push(newBook);
  return res.json({ books:addNewBook, message:"Book was added" });
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
  AuthorModel.create(newAuthor);
  // database.author.push(newAuthor);
  return res.json({ message:"Author was added"});
});


/*
Route           /publication/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/publication/add", (req, res) => {
  const { newPublication } = req.body;
  PublicationModel.create(newPublication);
  // database.publication.push(newPublication);
  return res.json({message:"Publication was added"});
});


/*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", async(req, res) => {

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.newBookTitle,
    },
    {
      new: true, // to get updated data
    }
  );
  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.title = req.body.newBookTitle;
  //     return;
  //   }
  // });

  // return res.json({ books: database.books });
  return res.json({ books:updatedBook });
});



/*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/author/:isbn", async(req, res) => {
  // update book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        author: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     return book.author.push(parseInt(req.params.authorId));
  //   }
  // });
  // update author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  // database.author.forEach((author) => {
  //   if (author.id === parseInt(req.params.authorId))
  //     return author.books.push(req.params.isbn);
  // });

  // return res.json({ books: database.books, author: database.author });
  return res.json({
    books: updatedBook,
    author: updatedAuthor,
    message: "New author was added 🚀",
  });
});


/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
  //update the publication database
  database.publication.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publication,
    message: "Successfully updated publication"
  });

});


/* 
Route         /book/delete
Description   Delete a book
Access        Public
Parameter     isbn
Methods       delete

*/
booky.delete("/book/delete/:isbn",async (req, res) => {

  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  //Tadeoff
  //Replace the whole object(map)
  //edit at single point to master dsatabase (foreach)

  // const updatedBookDatebase = database.books.filter(
  //   (book) => book.ISBN !== req.params.isbn
  // );
  // ----filter will return new array
  // database.books = updatedBookDatebase;
  // return res.json({ books: database.books });
  return res.json({ books:updatedBookDatabase });


});

/* 
Route         /book/delete/author
Description   Delete a author from a book
Access        Public
Parameter     isbn
Methods       delete

*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {

  //Update Book Database 
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;

    }

  });
  //Update Author
  database.author.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      author.books = newBooksList;
      return;
    }
  });
  return res.json({
    books: database.books,
    author: database.author,
    message: "Successfully Deleted Author",
  });

});


/* 
Route         /publication/delete/book
Description   Delete a book from publication 
Access        Public
Parameter     isbn,publication id
Methods       delete

*/

booky.delete("/publication/update/book/:isbn/:pubId", (req, res) => {

  //Update Publication database
  database.publication.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      publication.books = newBooksList;
      return;

    }
  });

  //Update book database 
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; //No publication available
      return;
    }
  });
  return res.json({
    books: database.books,
    publication: database.publication,
    message: "Successfully Deleted Author",
  });

});

booky.listen(3000, () => console.log("Server is running"))
