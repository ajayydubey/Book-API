 
const books = [
    {
    ISBN:"12345Book",
    title:"MERN",
    pubDate:"2021=07-07",
    language:"en",
    numPage:250,
    author:[1,2],
    publications: [1],
    category:["tech","programming","education"],
},
];


const author=[
    {
        id:1,
        names: "Ajay",
        books: ["12345Book", "123Sec"],
    },

    {
        id:2,
        names: "Elon Musk",
        books: ["12345Book"],
    }


];

const publication = [
    {
        id:1 ,
        names: "Writex",
        books: ["12345Book"],
    }
];

module.exports={books,author,publication};