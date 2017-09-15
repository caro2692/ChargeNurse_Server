const knex = require('./knex');

module.exports = {
  getAllPatients: (shift_id) => {
    const promises = [
      knex('patient')
    ];
    return Promise.all(promises)
      .then(results=> {
        const patients = results[0];
        return Promise.all(
          patients.map(patient=>{
            return knex('patient_objective_acuity')
            .leftJoin('objective_acuity', 'patient_objective_acuity.objective_acuity_id', 'objective_acuity.id')
            .where('patient_id', patient.id)
            .andWhere('patient_objective_acuity.shift_id',shift_id)
            .then(patient_oacuity=>{
              patient.oacuity = patient_oacuity;
            });
          }),
          //map same but for subjective
          patients.map(patient=>{
            return knex('patient_subjective_acuity')
            .leftJoin('subjective_acuity', 'patient_subjective_acuity.subjective_acuity_id', 'subjective_acuity.id')
            .where('patient_id', patient.id)
            .andWhere('patient_subjective_acuity.shift_id',shift_id)
            .then(patient_sacuity=>{
              patient.sacuity = patient_sacuity;
            });
          })
        ).then(()=>{
          return patients;
        });
      });
  },
  getAllNurses: (shift_id) => {
    const promises = [
      knex('nurse'),
      knex('patient_nurse').where('shift_id', shift_id)
    ];
    return Promise.all(promises)
      .then(results=>{
        const nurses = results[0];
        const assignements = results[1];
        //go through assignement_nurse and have nurse_id: assignements
        return Promise.all(
          nurses.map(nurse=>{
            return knex('nurse_objective_acuity')
            .leftJoin('objective_acuity', 'nurse_objective_acuity.objective_acuity_id', 'objective_acuity.id')
            .where('nurse_id', nurse.id)
            .then(nurse_oacuity=>{
              nurse.oacuity = nurse_oacuity;
            });
          }),
          assignements.map(assignement=>{
            return knex('patient')
            .where('id', assignement.patient_id)
            .first()
            .then(patient_info=>{
              assignement.patient_info = patient_info;
            });
          })
        ).then(()=>{
          nurses.forEach((nurse)=>{
            nurse.patients = [];
            assignements.forEach((assignement)=>{
              if(assignement.nurse_id===nurse.id){
                  nurse.patients.push(assignement);
              }
            });
          });
          return nurses;
        });
      });
  },
  getOnePatient: (id) => {
    return knex('patient').where('id', id);
  },
  getOneNurse: (id) => {
    return knex('nurse').where('id', id);
  }
};
