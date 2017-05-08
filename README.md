# No Swearing
This repository contains the back-end database calls, and entire database scripts and seeds for the project ColourScape.

### ColourScape Description
Got an amazing outfit but no walls to take photos in front of? Browse Toronto and its various neighbourhoods by your desired colour palettes with Colourscape.

![ColourScape landing page](https://cloud.githubusercontent.com/assets/14142540/25826266/30427b04-3414-11e7-8f6b-4dfde6fe356b.png)
![ColourScape users dashboard](https://cloud.githubusercontent.com/assets/14142540/25826278/318866cc-3414-11e7-9ff2-6109522f0ff9.png)

### ColourScape tech stack
- React
- JavaScript
- Postgres
- Google Cloud Platform Vision API
- Google Maps API
- Flickr API

### How to use seed files
Type the following on command line, and enter password when prompted.
```
psql -U <your_dbname> <your_username>
```
Once inside your database, run these three commands to clear your database and (more importantly,) to _reset the IDs of the tables_:
```
TRUNCATE TABLE imagesdb RESTART IDENTITY CASCADE;
TRUNCATE TABLE usersdb RESTART IDENTITY CASCADE;
TRUNCATE TABLE likesdb RESTART IDENTITY;
```
Exit database, and run 'knex seed:run'.
