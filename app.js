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

app.get('/create', (req, res) => {
    res.render("signup");
});

app.post('/create', async (req, res) => {
    const { name, email, pass, userImg } = req.body;
    try {
        let newUser = await userModel.create({
            name: name,
            email: email,
            pass: pass,
            imgUrl: userImg
        });
        // res.send(alert(`User ${newUser.name} created successfully!`));
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Error creating user");
    }
});

// show users 
app.get('/userdata', async (req, res) => {
    let alldata = await userModel.find();
    res.render("userdata", {udata: alldata});
});

// profile Route
app.get('/profile/:name', async (req, res) => { 
    let userProfile = await userModel.findOne({name: req.params.name});
    res.render("profile", {userProfile});
});

app.post('/update', async (req, res) => {
    const {name, email, pass} = req.body;
    let userUpdate = await userModel.updateOne({name:name, email: email, pass: pass});
    // let updateData = await userModel.find({name:name});
    // res.redirect(`/profile/${updateData.name}`);
});

app.get('/delete', async (req, res) => {
    res.render("delete");
});

// delete in userdata page 
app.get('/delete/:useremail', async (req, res) => {
    let deleteuser = await userModel.findOneAndDelete({email: req.params.useremail});
    res.redirect("/userdata");
});

// delete in profile 
app.get('/profile/:useremail/delete', async (req, res) => {
    let deleteprofileuser = await userModel.findOneAndDelete({email: req.params.useremail});
    res.redirect("/userdata");
});

// delete page user delete 
app.post('/delete', async (req, res) => {
    const { name, pass } = req.body;
    try {
        let deleteuser = await userModel.findOneAndDelete({ name: name, pass: pass });
        if (deleteuser) {
            res.render('delete', { message: `User ${name} has been successfully deleted.` });
        } else {
            res.render('delete', { message: `User ${name} not found or incorrect password.` });
        }
    } catch (err) {
        console.error(err);
        res.render('delete', { message: `Error deleting user` });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000/');
});
