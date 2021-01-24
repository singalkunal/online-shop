const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

const db = require('./utils/database');
const rootDir = require('./utils/path');
const publicDir = path.join(rootDir, 'public');
const errorController = require(path.join(rootDir, 'controllers', 'errors'));


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app = express();

// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));

db.execute('Select * from products')
.then(data => {
    console.log(data[0], data[1]);
})
.catch(err => {
    console.log("Error: ", err);
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicDir));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 page
app.use(errorController.get404);

app.listen(3000);