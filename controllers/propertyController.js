const Property = require('../models/propertyModel');
const fs = require('fs');
const path = require('path');

// Create a new property
const createProperty = async (req, res) => {
  try {
    const { category, propertyName, propertyDescription, perNightPrice, location, startDate, endDate } = req.body;

    // Handle image paths
    const mainImageFile = req.files['mainImageFile'] ? req.files['mainImageFile'][0] : null;
    const sliderImages = req.files['slider_images'] || [];

    // Create a new property document
    const newProperty = new Property({
      category,
      propertyName,
      propertyDescription,
      perNightPrice,
      location,
      mainImageFile: mainImageFile ? mainImageFile.path : null,  // Saving file paths in DB
      sliderImages: sliderImages.map(file => file.path),  // Saving paths for slider images
      startDate,
      endDate,
    });

    // Save to the database
    await newProperty.save();
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding property', error });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find(); 
    res.status(200).json(properties); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
};


const getProperty = async (req, res) => {
  try {
    const { id } = req.params;  // Get the id from the route parameters
    const property = await Property.findById(id);  // Find the property by id

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });  // If property not found, return a 404 error
    }

    res.status(200).json(property);  // Return the found property as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching property', error });  // Handle server error
  }
};


const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log('Deleting property with id:', id); 

    const property = await Property.findById(id); 
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });  
    }


    if (property.mainImageFile) {
      const mainImagePath = path.join(__dirname, '..', property.mainImageFile); // Adjust path as necessary
      console.log('Deleting main image at path:', mainImagePath); // Log image path
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
        console.log('Main image deleted successfully');
      } else {
        console.log('Main image file not found');
      }
    }

    if (property.sliderImages && Array.isArray(property.sliderImages)) {
      property.sliderImages.forEach(image => {
        const sliderImagePath = path.join(__dirname, '..', image); // Adjust path as necessary
        console.log('Deleting slider image at path:', sliderImagePath); // Log each image path
        if (fs.existsSync(sliderImagePath)) {
          fs.unlinkSync(sliderImagePath);
          console.log('Slider image deleted successfully');
        } else {
          console.log('Slider image not found');
        }
      });
    }

    const deletedProperty = await Property.findByIdAndDelete(id); 
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found during deletion' });
    }

    console.log('Property deleted successfully');
    res.status(200).json({ message: 'Property and images deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting property and images', error });
  }
};



module.exports = { createProperty,getAllProperties,getProperty,deleteProperty  };
