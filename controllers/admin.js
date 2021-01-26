const Product = require('../models/product');
const User = require('../models/user');

exports.getAddProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const price = Number(req.body.price);
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const user = req.user;

    user.createProduct({
        title,
        price,
        imgUrl,
        description
    }).then(result => {
        // console.log(result);
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    const id = req.params.productId;
    const edit = req.query.edit;
    
    req.user.getProducts({where: {id}})
    .then((products) => {
        res.render('admin/edit-product', {
            product: products[0],
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            edit,
        });
    })
    .catch(err => console.log(err))
};

exports.postEditProduct = (req, res) => {
    const prodId = req.body.productId;
    const updTitle = req.body.title;
    const updPrice = Number(req.body.price);
    const updImgUrl = req.body.imgUrl;
    const updDesc = req.body.description;

    Product.update({
        title: updTitle,
        price: updPrice,
        imgUrl: updImgUrl,
        description: updDesc
    }, {
        where: {
            id: prodId
        }
    })
    .then(() => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.destroy({
        where: {
            id: prodId
        }
    })
    .then(() => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            });
    })
    .catch(err => {
        console.log(err);
    });
    
};