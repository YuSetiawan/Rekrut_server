const Pool = require('../config/db');

const selectAllExperience = ({limit, offset, sort, sortby}) => {
  return Pool.query(`SELECT * FROM experience ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

const selectExperience = (id) => {
  return Pool.query(`SELECT * FROM experience  WHERE id = '${id}'`);
};

const selectExperienceUsers = (id_users) => {
  return Pool.query(`SELECT * FROM experience WHERE id_users = '${id_users}'`);
};

const deleteExperience = (id) => {
  return Pool.query(`DELETE FROM experience WHERE id  = '${id}'`);
};

const createExperience = (data) => {
  const {id, job_position, company_name, working_started, working_ended, description, id_users} = data;
  return Pool.query(`INSERT INTO experience(id,job_position,company_name,working_started,working_ended,description,id_users) 
    VALUES ('${id}','${job_position}','${company_name}','${working_started}','${working_ended}','${description}','${id_users}')`);
};

const updateExperience = (data) => {
  const {id, job_position, company_name, working_started, working_ended, description} = data;
  return Pool.query(`UPDATE experience SET  job_position = '${job_position}', company_name = '${company_name}', working_started = '${working_started}', working_ended = '${working_ended}', description = '${description}' WHERE id = '${id}'`);
};

const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM experience WHERE id= '${id}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findUser = (id_users) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM experience WHERE id_users= '${id_users}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM experience`);
};

module.exports = {
  selectAllExperience,
  selectExperience,
  selectExperienceUsers,
  deleteExperience,
  createExperience,
  updateExperience,
  findID,
  findUser,
  countData,
};
