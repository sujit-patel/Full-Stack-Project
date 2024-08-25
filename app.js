import express from 'express';
import userModel from './db.js';
import bodyParser from 'body-parser';
// import { name } from 'ejs';

const app = express();

// Middleware to parse form data
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    // res.send("My Server Is Ready...");
    res.render("index");
});

app.get('/userdata', async (req, res) => {
    let alluser = await userModel.find();
    res.render("userdata", {users : alluser});
});

app.get('/delete', async (req, res) => {
    res.render("delete");
});

app.post('/delete', async (req, res) => {
    const {name, pass} = req.body;
    let deleteuser = await userModel.findOneAndDelete({ name: name });
    res.send(deleteuser);
});

app.get('/create', (req, res) => {
    res.render("create");
});

app.post('/create', async (req, res) => {
    const { name, email, pass } = req.body;

    try {
        let newUser = await userModel.create({
            name: name,
            email: email,
            pass: pass
        });
        res.send(`User ${newUser.name} created successfully!`);
    } catch (err) {
        res.status(500).send("Error creating user");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
