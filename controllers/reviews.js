const Listing = require('./../models/listing.js');
const Review = require('./../models/review.js');

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id;

    review = await review.save();
    listing.reviews.push(review);
    listing = await Listing.findByIdAndUpdate(req.params.id, listing);
    req.flash('success', 'New Review Created!');
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    await Listing.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${req.params.id}`);
};
