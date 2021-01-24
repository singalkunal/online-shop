const Product = require('../models/product');

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
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const product = new Product(null, title, price, imgUrl, description);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    const id = req.params.productId;
    const edit = req.query.edit;
    
    Product.getById(id, product => {
        res.render('admin/edit-product', {
            product,
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            edit,
        });
    })
};

exports.postEditProduct = (req, res) => {
    const prodId = req.body.productId;
    const updTitle = req.body.title;
    const updPrice = req.body.price;
    const updImgUrl = req.body.imgUrl;
    const updDesc = req.body.description;

    const product = new Product(prodId, updTitle, updPrice, updImgUrl, updDesc);
    product.save();
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
            res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
    
};