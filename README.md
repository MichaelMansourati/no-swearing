# No Swearing
This repository contains the back-end database calls, and entire database scripts and seeds for the project ColourScape.

## ColourScape Description
Got an amazing outfit but no walls to take photos in front of? Browse Toronto and its various neighbourhoods by your desired colour palettes with Colourscape.

## Stack Requirements
- React
- JavaScript
- Google Cloud Platform Vision API
- Flickr API

## How to use seed files
Run 'psql -U _your_dbname_ _your_username_' on command line, and enter password when prompted.
Once inside your database, run these three commands to clear your database and (more importantly,) to _reset the IDs of the tables_:
- TRUNCATE TABLE imagesdb RESTART IDENTITY CASCADE;
- TRUNCATE TABLE usersdb RESTART IDENTITY CASCADE;
- TRUNCATE TABLE likesdb RESTART IDENTITY;

Exit database, and run 'knex seed:run'.
