# No Swearing
This repository contains the back-end database calls, and entire database scripts and seeds for the project ColourScape.

## ColourScape Description
Browse Toronto by colour the next time you have a great outfit and need a matching wall for that perfect Instagram picture.

## Stack Requirements
- React
- JavaScript
- Google Cloud Platform Vision API
- Flickr API
- Google Maps API

## How to use seed files
Run 'psql -U _your_dbname_ _your_username_' on command line, and enter password when prompted.
Once inside your database, run these three commands to clear your database and (more importantly,) to _reset the IDs of the tables_:
- TRUNCATE TABLE imagesdb RESTART IDENTITY CASCADE;
- TRUNCATE TABLE usersdb RESTART IDENTITY CASCADE;
- TRUNCATE TABLE likesdb RESTART IDENTITY;

Exit database, and run 'knex seed:run'.
Enter back into the database, and double check that your imagesdb now contains 10372 entries :)
