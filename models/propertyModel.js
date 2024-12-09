const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  category: String,
  propertyName: String,
  propertyDescription: String,
  perNightPrice: Number,
  location: String,
  mainImageFile: String,  
  sliderImages: [String],  
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
