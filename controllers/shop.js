const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/products-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    })
    .catch(err => {
        console.log(err);
    });    
};

exports.getProductDetails = (req, res) => {
    const prodId = req.params.productId;
    Product.findAll({
        where: {
            id: prodId
        }
    }).then(products => {
        const product = products[0];
        res.render('shop/product-details', {
            pageTitle: product.title,
            product,
            path: '/products'
        });
    })
    .catch(err => {
        console.log(err)
    });

    
};

exports.getIndex = (req, res) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}

exports.getOrders = (req, res) => {
    req.user
    .getOrders({ include: ['products'] }) // Eager loading
    .then(orders => {
        // console.log(orders[0].products);
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders
        });
    })
}

exports.postOrder = (req, res) => {
    /***
     * Cart : Product => M : N
     * when products are fetched using cart
     * for ex cart.getProducts()
     * then (only) fetched products will also have
     * cartItem property
    ***/

    let fetchedProducts;
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        // console.log(cart.id);
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        fetchedProducts = products;
        return req.user
        .createOrder()
    })
    .then(order => {
        return order.addProducts(fetchedProducts.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity}
            return product;
        }))
    })
    .then((order) => {
        return fetchedCart.setProducts(null);
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));

}

exports.getCart = (req, res) => {
    req.user.getCart()
    .then(cart => {
        // console.log(cart.id);
        return cart.getProducts();
    })
    .then(products => {
        // console.log(products);
        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products
        });
    })
    .catch(err => console.log(err))

}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
    .getCart()
    .then(cart => {
        fetchedCart = cart;
        console.log(cart);
        return cart.getProducts({ where: { id: prodId }});
    })
    .then(products => {
        if(products.length > 0) {
            product = products[0];
            newQuantity = product.cartItem.quantity + 1;
            return product;
        }

        return Product.findByPk(prodId)
        
    })
    .then(product => {
        return fetchedCart.addProduct(product, { through: {quantity: newQuantity} });
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postCartDeleteItem = (req, res) => {
    const prodId = req.body.productId;
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts({ where: {id: prodId }});
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}