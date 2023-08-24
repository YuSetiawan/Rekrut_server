const Pool = require('../config/db');

const selectAllSkill = ({limit, offset, sort, sortby}) => {
  return Pool.query(`SELECT * FROM skills ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

const selectSkillUsers = (id_users) => {
  return Pool.query(`SELECT * FROM skills WHERE id_users = '${id_users}'`);
};

const deleteSkill = (id) => {
  return Pool.query(`DELETE FROM skills WHERE id  = '${id}'`);
};

const createSkill = (data) => {
  const {id, skill_name, id_users} = data;
  return Pool.query(`INSERT INTO skills(id, skill_name, id_users) 
    VALUES ('${id}','${skill_name}','${id_users}')`);
};

const updateSkill = (data) => {
  const {id, skill_name} = data;
  return Pool.query(`UPDATE skills SET skill_name = '${skill_name}' WHERE id = '${id}'`);
};

const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM skills WHERE id= '${id}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findSkill = (skill_name, id_users) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM skills WHERE skill_name = '${skill_name}' AND id_users = '${id_users}'`, (error, result) => {
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
    Pool.query(`SELECT * FROM skills WHERE id_users= '${id_users}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM skills`);
};

module.exports = {
  selectAllSkill,
  selectSkillUsers,
  deleteSkill,
  createSkill,
  updateSkill,
  findID,
  findUser,
  findSkill,
  countData,
};
