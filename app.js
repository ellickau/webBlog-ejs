import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.port || 3000;

app.use(express.static('public'));
app.set("view engin", "ejs");
app.use(bodyParser.urlencoded({extended: true}));  

const posts = [];
let nextId = 1; 

function addPost(title, content) {
    const post = {
        id: nextId++, 
        title: title,
        content: content,
        date: new Date().toLocaleString(),
    };
    posts.push(post);
    return post;
};

app.get('/', (req, res) => {
    res.render('index.ejs', { posts: posts, editingPost: null } );
});

app.post('/blog', (req, res) => {  
    addPost(req.body.title, req.body.content);
    console.log(posts);
    res.redirect("/");
});    

app.get('/edit', (req, res) => {
    const id = Number(req.query.postid);
    
    if (!Number.isInteger(id)) return res.status(400).send("Invalid id");

    const post = posts.find( p=> p.id === id);
    if (!post) return res.status(404).send("Post not found");

    res.render("index.ejs", { posts, editingPost: post }); 
    console.log(posts);
});

app.post("/edit", (req, res) => {
  const id = Number(req.body.id);
  const post = posts.find(p => p.id === id);

  if(!post) return res.status(404).send("Post not found");
  post.title = req.body.title;
  post.content = req.body.content;
  post.date = new Date().toLocaleString();
  res.redirect("/");
});

app.get('/delete', (req, res) => {
    const id = Number(req.query.postid);
    const i = posts.findIndex(p => p.id === id);
    if (i !== -1 ) posts.splice(i, 1);
    console.log(id);
    console.log(posts);
    res.redirect("/");
});


app.listen(port, ()=> {
    console.log(`Server lsitening on port ${port}`);
});

