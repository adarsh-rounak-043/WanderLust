const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});
const Listing = require('./../models/listing.js');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render('listings/index.ejs', {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');

    if(!listing) {
        req.flash('error', 'Listing you requested for does not exist');
        res.redirect('/listings');
    } else {
        res.render('listings/show.ejs', {listing});
    }
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url = req.file.path, filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save({runValidators: true});
    console.log(savedListing);
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        req.flash('error', 'Listing you requested for does not exist');
        res.redirect('/listings');
    } else {
        let originalImage = listing.image.url;
        originalImage = originalImage.replace('/upload', '/upload/w_250');
        res.render('listings/edit.ejs', {listing, originalImage});
    }
};

module.exports.updateListing = async (req, res) => {
    const editedListing = req.body.listing;
    if(req.file) {
        let {path, filename} = req.file;
        editedListing.image = {url: path, filename};
    }
    await Listing.findByIdAndUpdate(req.params.id, editedListing, {runValidators: true});
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
};
