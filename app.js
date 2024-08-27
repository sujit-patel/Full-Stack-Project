import express from 'express';
import userModel from './db.js';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse form data
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => { 
    res.render("index");
});

app.get('/views/:fileName', async (req, res) => {
    let alldata = await userModel.find();
    res.render(`${req.params.fileName}`, {udata: alldata});
});

app.get('/userdata', async (req, res) => {
    let alldata = await userModel.find();
    res.render("userdata", {udata: alldata});
});

app.get('/delete', async (req, res) => {
    res.render("delete");
});

app.post('/delete', async (req, res) => {
    const { name } = req.body;
    try {
        let deleteuser = await userModel.findOneAndDelete({ name: name });
        if (deleteuser) {
            res.send(`User ${name} deleted successfully!`);
        } else {
            res.status(404).send(`User ${name} not found.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");
    }
});

app.get('/create', (req, res) => {
    res.render("signup");
});

app.post('/create', async (req, res) => {
    const { name, email, pass } = req.body;
    try {
        let newUser = await userModel.create({
            name: name,
            email: email,
            pass: pass
        });
        // res.send(alert(`User ${newUser.name} created successfully!`));
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Error creating user");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000/');
});
