const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

const sequelize = require('./utils/database');
const rootDir = require('./utils/path');
const publicDir = path.join(rootDir, 'public');
const errorController = require(path.join(rootDir, 'controllers', 'errors'));

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app = express();

// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicDir));

// middleware for passing dummy user
app.use((req, res, next) => {
    User.findByPk(1) 
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 page
app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

const PORT = process.env.PORT || 3000;
sequelize
// .sync({ force: true})
.sync()
.then(result => {
    // console.log(result);
    return User.findByPk(1);
})
.then(user => {
    if(!user) {
        return User.create({
            name: 'kunal',
            email: 'dummy@dummy.com'
        });
    }

    // user will automatically be wrapped in Promise
    return user;
})
.then(user => {
    user.getCart()
    .then(cart => {
        if(!cart) {
            return user.createCart();
        }

        return cart;
    })
    .catch(err => console.log(err));
})
.then(cart => {
    // console.log(user);
    app.listen(PORT, () => {
        console.log(`App listening on ::${PORT}`);
    });
})
.catch(err => {
    console.log(err);
});
