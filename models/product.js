const db = require('../utils/database');
const rootDir = require('../utils/path');
// const p = path.join(rootDir, 'data', 'products.json');

const Cart = require('./cart');

// const getProductsList = callback => {
//     fs.readFile(p, (err, buff) => {
//         if (err || buff.length === 0) {
//             callback([]);
//         }

//         else
//         callback(JSON.parse(buff));
        
//     });
// };

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
        return db.execute(
            'INSERT INTO products (title, price, description, imgUrl) VALUES (?, ?, ?, ?)', 
        [this.title, +this.price, this.description, this.imgUrl]);
    }

    static deleteById(prodId) {
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static getById(id) {
        return db.execute('SELECT * FROM products as p WHERE p.id = ?', [id]);
    }
};
