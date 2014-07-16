'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var games = [];
var app = express();
app.use(bodyParser.json());

app.param('id', function (req, res, next, id) {
  if (!id.match(/^\d+$/) || parseInt(id) >= games.length) {
    res.status(404);
  }
  next();
});

app.route('/_api/minesweeper/game')
  .get(function (req, res) {
    res.send(games);
  })
  .post(function (req, res) {
    req.body.id = games.length;
    games.push(req.body);
    res.send(req.body);
  });

app.route('/_api/minesweeper/game/:id')
  .get(function (req, res) {
    res.send(games[req.params.id]);
  })
  .post(function (req, res) {
    res.send(games[req.params.id] = req.body);
  })
  .delete(function (req, res) {
    res.send(games[req.params.id] = undefined);
  });

app.listen(3000);