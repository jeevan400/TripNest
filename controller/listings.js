const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});


module.exports.home = async (req, res) => {
  let all_listing = await Listing.find({});
  res.render("./listing/index.ejs", { all_listing });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("./listing/new.ejs");
};

module.exports.createNew = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let list = req.body.listing;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing.");
  }
  let newListing = new Listing(list);
  newListing.geometry = response.body.features[0].geometry;//GeoJSON
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/h_250, w_300");
  res.render("./listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let list = req.body.listing;
  let newListing = await Listing.findByIdAndUpdate(
    id,
    { ...list },
    { runValidators: true, new: true }
  );
  // console.log(newListing);
  // console.log(id);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    await newListing.save();
  }
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.distroy = async (req, res) => {
  let { id } = req.params;
  let deletedItem = await Listing.findByIdAndDelete(id);
  console.log(deletedItem);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing You requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { list });
};
