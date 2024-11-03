//  cloudinary = require('../utils/cloudinary'); // Ensure Cloudinary is configured
import cloudinary from 'cloudinary';
// const connectDB = require("../utils/db");
import { connectDB } from '../utils/db.js';

export const uploadEvent = async (req, res) => {
  let client;
  try {
    // Connect to the database
    client = await connectDB();

    const { eventNumber, eventDescription, eventDate, mediaBase64, mediaType } = req.body;

    // Check if media data is provided
    if (!mediaBase64) {
      return res.status(400).json({ error: 'No media data provided' });
    }

    // Set the resource type based on the mediaType provided ('image' or 'video')
    let resourceType;
    if (mediaType === 'video') {
      resourceType = 'video';
    } else if (mediaType === 'image') {
      resourceType = 'image';
    } else {
      return res.status(400).json({ error: 'Invalid media type. Please specify "image" or "video".' });
    }

    // Upload media to Cloudinary
    const uploadMedia = () =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          mediaBase64, // Upload base64 encoded media (image or video)
          { resource_type: resourceType }, 
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url); // Return the media URL
            }
          }
        );
      });

    // Wait for the media to be uploaded to Cloudinary
    const mediaUrl = await uploadMedia();

    // Insert event details into the database, including the media URL
    const queryText = `
      INSERT INTO Events (eventNumber, eventDescription, eventDate, eventMediaUrl)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const queryValues = [eventNumber, eventDescription, eventDate, mediaUrl];

    const result = await client.query(queryText, queryValues);

    // Send the newly created event as the response
    return res.status(200).json({
      message: 'Event created successfully',
      event: result.rows[0], // Return the newly inserted event
    });

  } catch (error) {
    // Error handling
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while processing the request' });
  } finally {
    // Ensure the database connection is released if the client was initialized
    if (client) {
      client.release();
    }
  }
};

export const getAllEventImages = async (req, res) => {
    let client;
  
    try {
      // Connect to the database
      client = await connectDB();
  
      // Query the database to retrieve all event image URLs
      const queryText = 'SELECT eventNumber, eventDescription, eventDate, eventMediaUrl FROM Events';
  
      const result = await client.query(queryText);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No events found' });
      }
  
      // Send the list of events with media URLs as the response
      return res.status(200).json({
        message: 'Events retrieved successfully',
        events: result.rows // Return all event records
      });
  
    } catch (error) {
      // Error handling
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while fetching the events' });
    } finally {
      // Ensure the database connection is released if the client was initialized
      if (client) {
        client.release();
      }
    }
  };



