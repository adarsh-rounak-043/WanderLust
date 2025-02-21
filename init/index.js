const mongoose = require('mongoose');

const Listing = require('../models/listing.js');
let initData = require('./data.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(() => {
        console.log('connected to db');
    }).catch(err => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '67b21f03fb443d587e9c1bd2'}));
    await Listing.insertMany(initData.data);
    console.log('data was initialized');
};

initDB();
