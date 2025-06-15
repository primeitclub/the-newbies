-- Database Setup Instructions for Appwrite
-- 
-- This script provides the structure for setting up your Appwrite database.
-- You'll need to create these collections manually in the Appwrite console.

-- Collection: properties
-- Attributes:
-- title (string, required)
-- description (string, required) 
-- price (integer, required)
-- location (string, required)
-- address (string, required)
-- roomType (string, required) -- enum: single, shared, apartment, hostel
-- amenities (string array, required)
-- images (string array, required)
-- landlordId (string, required)
-- available (boolean, required, default: true)
-- coordinates (object, optional) -- {lat: number, lng: number}
-- nearbyPlaces (object array, optional) -- [{name: string, distance: string}]
-- rules (string array, optional)
-- createdAt (datetime, required)
-- updatedAt (datetime, required)

-- Collection: users  
-- Attributes:
-- name (string, required)
-- email (string, required, unique)
-- phone (string, optional)
-- userType (string, required) -- enum: student, landlord, admin
-- verified (boolean, required, default: false)
-- avatar (string, optional)
-- college (string, optional)
-- preferences (object, optional)
-- createdAt (datetime, required)
-- updatedAt (datetime, required)

-- Collection: bookings
-- Attributes:
-- propertyId (string, required)
-- studentId (string, required) 
-- landlordId (string, required)
-- startDate (datetime, required)
-- endDate (datetime, optional)
-- status (string, required) -- enum: pending, confirmed, rejected, completed
-- totalAmount (integer, required)
-- paymentStatus (string, required) -- enum: pending, paid, refunded
-- createdAt (datetime, required)

-- Collection: reviews
-- Attributes:
-- propertyId (string, required)
-- studentId (string, required)
-- rating (integer, required) -- 1-5
-- comment (string, required)
-- createdAt (datetime, required)

-- Collection: favorites
-- Attributes:
-- userId (string, required)
-- propertyId (string, required)
-- createdAt (datetime, required)

-- Collection: messages
-- Attributes:
-- senderId (string, required)
-- receiverId (string, required)
-- propertyId (string, optional)
-- content (string, required)
-- read (boolean, required, default: false)
-- createdAt (datetime, required)

-- Collection: notifications
-- Attributes:
-- userId (string, required)
-- title (string, required)
-- message (string, required)
-- type (string, required) -- enum: booking, message, review, system
-- read (boolean, required, default: false)
-- createdAt (datetime, required)

-- Storage Buckets:
-- property-images (for property photos)
-- user-avatars (for user profile pictures)  
-- documents (for rental agreements, IDs, etc.)

-- Permissions:
-- Set appropriate read/write permissions for each collection
-- Properties: Public read, authenticated write (landlords only)
-- Users: Owner read/write
-- Bookings: Related users read/write
-- Reviews: Public read, authenticated write
-- Favorites: Owner read/write
-- Messages: Related users read/write
-- Notifications: Owner read/write

SELECT 'Database setup instructions provided above' as message;
