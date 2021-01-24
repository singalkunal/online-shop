const Product = require('../models/product');
const Cart = require('../models/cart');

// response is built inside callback as fetchAll uses async function (readFile)
// So we have products array ready only after the readFile is complete
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
            res.render('shop/products-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    });
    
};

exports.getProductDetails = (req, res) => {
    const prodId = req.params.productId;
    Product.getById(prodId, (product) => {
        res.render('shop/product-details', {
            pageTitle: product.title,
            product,
            path: '/products'
        });
    });

    
};

exports.getIndex = (req, res) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}

exports.getCart = (req, res) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];

            for (prod of products) {
                const cartProductData = cart.products.find(p => p.id === prod.id);
                if(cartProductData) {
                    cartProducts.push({
                        productData: prod,
                        qty: cartProductData.qty
                    });
                }
            }

            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cartProducts
            });
        });
    });

}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.getById(prodId, product => {
        Cart.addProduct(prodId, product.price);
        res.redirect('/cart');
    });

    // console.log(prodId, Product.getById(prodId, product => console.log(product)));
}

exports.postCartDeleteItem = (req, res) => {
    const prodId = req.body.productId;
    Product.getById(prodId, product => {
        if(product) {
            Cart.deleteProduct(prodId, product.price);
        }

        res.redirect('/cart');
    });
}