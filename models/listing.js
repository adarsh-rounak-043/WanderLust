const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const wrapAsync = require('./../utils/wrapAsync.js');

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// main()
//     .then(() => {
//         console.log('connected to mongodb');
//     }).catch(err => {
//         console.log(err);
//     });

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: [String],
        enum: ['Trending', 'Rooms', 'Iconic cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic']
    }
});

listingSchema.post('findOneAndDelete', wrapAsync(async (listing) => {
    if(listing.reviews.length) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    } else {
        next();
    }
}));

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
