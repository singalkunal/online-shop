const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');
const p = path.join(rootDir, 'data', 'products.json');

const Cart = require('./cart');

const getProductsList = callback => {
    fs.readFile(p, (err, buff) => {
        if (err || buff.length === 0) {
            callback([]);
        }

        else
        callback(JSON.parse(buff));
        
    });
};

module.exports = class Product{
    constructor(id, title, price, imgUrl, description) {
        // id will be null for new products
        this.id = id;
        this.title = title;
        this.price = price;
        this.imgUrl = imgUrl;
        this.description = description;
    }

    save() {
        getProductsList((products) => {
            if(this.id) {
                const existingProductIdx = products.findIndex(p => p.id === this.id);
                products[existingProductIdx] = this;
            }

            else {
                this.id = Math.random().toString();
                products.push(this);
            }

            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err) console.log("Error: ", err);
            });
        });
    }

    static deleteById(prodId) {
        getProductsList(products => {
            const idx = products.findIndex(p => p.id === prodId);
            const prodPrice = products[idx].price;
            products.splice(idx, 1);
            fs.writeFile(p, JSON.stringify(products), err => {
                if(err) {
                    console.log("Error: ", err);
                }
                else {
                    Cart.deleteProduct(prodId, prodPrice);
                }
            });
        })
    }

    static fetchAll(callback) {
        getProductsList(callback);
    }

    static getById(id, callback) {
        getProductsList((products) => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
};
