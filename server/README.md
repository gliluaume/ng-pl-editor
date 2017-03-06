# Editeur de playlists video
## v1.0.0
### server.js
Routes request to playlist repo. Handles :

 * GET one playlist for a given day
 * PATCH one playlist for a given day
 * GET all tracks details

### pl-repo.js

 * read / write playlist files
 * read tracks files using exifTool + grep + awk

### configuration.js
Describes configuration as a JavaScript object. Loaded as a module.