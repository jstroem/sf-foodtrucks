# sf-foodtrucks

This application was developed as a coding challange and was done within 3 days.

## Introduction

The app makes it possible for the user to see what food trucks that are in the San Fran area. The user can select a group of food types and the view will be filtered by this.

## Structure

The Application is divided into a frontend (see  `public/` folder) and a backend structure (see `lib/` folder). The hole application is written in JavaScript.

### Backend

The backend serves all files within the `public` folder and then it has one API method:
```
  GET /search?lat_from=...&lat_to=...&lon_from=...&lon_to=...
```
This endpoint provides a list of foodtrucks within that given square.

The backend service does not use any databases and makes the searches with a binary searcher on the `latitude` property and then a scan to filter the `longitude` property.

### Frontend

The frontend is written without any use of external libraries (Except google maps).

It uses CSS3 for animations (side navigation menu) and the JavaScript is structured into modules.

## TODO

* Documentation on the frontend.
* Unit tests on the frontend.
* Stress tests on the backend.
* Performance test on the backend.

## Test

The backend can be tested using: `npm test`

## Start

The application is running currently on heroku: `https://truckthatfood.herokuapp.com/` and can be started locally either by `npm start` or by using the `Dockerfile` included in the repo.

## Thoughts on the architecture

### Client side only

One solution would be to just serve the json file (`sf_datasheet.json`) to the client and then make that handle all the parsing and searching, just like I do on my backend in my final solution. One could even use `IndexedDB` as database and then cache everything.

This would scale well in in the number of users since you can cache the datasheet, however in the number of trucks or cities to serve this would at some point take to long to load initially.

### More full flexed setup

Another solution would be to load in the datasheet in a database (ex. `MySQL`) and then make the backend talk to the database. However since the datasheet is only within ~750 rows my thought was that this would be overkill until the number of cities/trucks went up a bit.

### The solution I took

I went with a solution that had a little bit of frontend and backend. The backend does the searching given a geographical area and the frontend does the filtering on food types.

#### A bit about scaling:

If the number of users is going up one could just add a loadbalancer and add more services.

If you extend the application to other cities one could make a loadbalancer that checked what city was queried (say you could only query one city at a time) and then have a bunch of services that handled searches on that city.

However I think if you increase both the number of cities and trucks it would be smart to describe the common factors for the Food Trucks and then put them together into a database and use that to search in.

_Notice:_ Most of the work that needed to be done if the app was going to scale is on the backend. That would be a nice feature in some scenarios (ex. On mobile apps where users needs to update their client).


## About me

Linkedin: https://www.linkedin.com/in/jesper-lindstr%C3%B8m-nielsen-45730940?trk=hp-identity-name

Github: https://github.com/jstroem
