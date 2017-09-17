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

Router.post('/assignement', (req, res) => {
  Queries.insertOneAssignement(req.body)
    .then(result=>{
        res.send(result);
    });
});

Router.delete('/assignement', (req, res) => {
  console.log('in route');
  console.log(req.query);
  console.log('that was query');
  console.log(req.params);
  console.log(req.body);
  Queries.deleteOneAssignement(req.body)
    .then(result=>{
        res.send('deleting one assignement');
    });
});

module.exports = Router;
