const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries');

Router.get('/', (req, res) => {
  Queries.getAllNurses()
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

module.exports = Router;
