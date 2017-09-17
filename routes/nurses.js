const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries');

Router.get('/shift/:id', (req, res) => {
  Queries.getAllNurses(req.params.id)
    .then(result=>{
        res.send(result);
    });
});


Router.get('/:id', (req, res) => {
  Queries.getOneNurse(req.params.id)
    .then(result=>{
        res.send(result);
    });
});

Router.post('/assignment', (req, res) => {
  Queries.insertOneAssignment(req.body)
    .then(result=>{
        res.send(result);
    });
});

Router.delete('/assignment', (req, res) => {
  Queries.deleteOneAssignment(req.query)
    .then(result=>{
        res.send('deleting one assignment');
    });
});

Router.put('/assignment', (req, res) => {
  Queries.updateOneAssignment(req.body)
    .then(result=>{
      res.send(result);
    });
});


module.exports = Router;
