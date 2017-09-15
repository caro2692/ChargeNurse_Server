const knex = require('./knex');

module.exports = {
  getAllPatients: () => {
    return knex('patient');
  },
  getAllNurses: (shift_id) => {
    const promises = [
      knex('nurse'),

    //  knex('patient'),

      knex('patient_nurse').where('shift_id', shift_id)
    ]
    return Promise.all(promises)
      .then(results=>{
        //console.log(results);
        const nurses = results[0];
      //  const patients = results[1];
        const assignements = results[1];
        return Promise.all(
          assignements.map(assignement=>{
            return knex('patient')
            .where('id', assignement.patient_id)
            .first()
            .then(patient_info=>{
              console.log(patient_info)
              assignement.patient_info = patient_info;
            })
          })
        ).then(()=>{
          nurses.forEach((nurse)=>{
            nurse.patients = [];
            assignements.forEach((assignement)=>{
              if(assignement.nurse_id===nurse.id){
                  nurse.patients.push(assignement)
              }
            })
          })

          return nurses;
        })
      })
  },
  getOnePatient: (id) => {
    return knex('patient').where('id', id);
  },
  getOneNurse: (id) => {
    return knex('nurse').where('id', id);
  }
};
