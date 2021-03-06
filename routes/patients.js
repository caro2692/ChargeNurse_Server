const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries');

/* GET home page. */
Router.get('/shift/:id', (req, res) => {
  Queries.getAllPatients(req.params.id)
    .then(result=>{
        res.send(result);
    });
});

Router.get('/:id', (req, res) => {
  Queries.getOnePatient(req.params.id)
    .then(result=>{
        res.send(result);
    });
});

module.exports = Router;
