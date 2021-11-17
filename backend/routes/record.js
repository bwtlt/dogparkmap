const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware
// and will take control of requests starting with path /parks.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/connection');

// This section will help you get a list of all the records.
recordRoutes.route('/parks').get(async (_req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('parks')
    .find({})
    .limit(50)
    .toArray((err, result) => {
      if (err) {
        res.status(400).send('Error fetching parks!');
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
recordRoutes.route('/parks/add').post((req, res) => {
  const dbConnect = dbo.getDb();
  const parkDocument = {
    last_modified: new Date(),
    session_id: req.body.session_id,
    name: req.body.name,
    position: req.body.position,
  };

  dbConnect
    .collection('parks')
    .insertOne(parkDocument, (err, result) => {
      if (err) {
        res.status(400).send('Error inserting park!');
      } else {
        console.log(`Added a new park with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});

// This section will help you update a record by id.
recordRoutes.route('/parks/update').post((req, res) => {
  const dbConnect = dbo.getDb();
  const parkQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1,
    },
  };

  dbConnect
    .collection('parks')
    .updateOne(parkQuery, updates, (err, _result) => {
      if (err) {
        res
          .status(400)
          .send(`Error updating park with id ${parkQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

// This section will help you delete a record.
recordRoutes.route('/parks/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const parkQuery = { park_id: req.body.id };

  dbConnect
    .collection('parks')
    .deleteOne(parkQuery, (err, _result) => {
      if (err) {
        res
          .status(400)
          .send(`Error deleting park with id ${parkQuery.park_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = recordRoutes;
