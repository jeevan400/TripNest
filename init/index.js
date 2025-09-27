const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/tripnest");
}
main().then(()=>{
    console.log("Connected DB");
})
.catch((err)=>{
    console.log(err);
});

const initializeData = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "68cb886cd00ad2196cc64077"}));
    await Listing.insertMany(initData.data);
    console.log("Data Save successfully");
}
initializeData();