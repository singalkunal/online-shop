const fs = require('fs');
const path = require('path');
const { callbackify } = require('util');

const rootDir = require('../utils/path');
const p = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, buff) => {
            let cart = {products: [], totalPrice: 0};
            if(!err && buff.length !== 0) {
                cart = JSON.parse(buff);
            }

            const existingProduct = cart.products.find(
                prod => prod.id === id
            );

            if(existingProduct) {
                existingProduct.qty += 1;
            }
            else {
                const newProduct = {id, qty: 1};
                cart.products.push(newProduct);
            }

            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err) {
                    console.log("Error: ", err);
                }
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, buff) => {
            if(err) {
                console.log("Error reading cart", err);
                return;
            }

            var cart = JSON.parse(buff);

            const product = cart.products.find(
                prod => prod.id === id
            );


            if(!product) {
                return;
            }
            
            const productQty = product.qty;
            cart.products = cart.products.filter(prod => prod.id !== id);
            cart.totalPrice -= productPrice * productQty;

            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err) {
                    console.log(err);
                }
            })

        });
    }

    static getCart(callback) {
        fs.readFile(p, (err, buff) => {
            let cart = {products: [], totalPrice: 0};
            if(!err && buff.length !== 0) {
                cart = JSON.parse(buff);
            }

            callback(cart);
        });
    }
}
