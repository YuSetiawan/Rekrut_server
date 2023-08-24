const Pool = require('../config/db');

const selectAllUsers = ({limit, offset, sort, sortby}) => {
  // return Pool.query(`SELECT * FROM users ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
  return Pool.query(
    `SELECT users.id, name, email, users.photo, job_position, company_name, phone, location, role, array_agg(skills.skill_name ORDER BY skills.skill_name ) AS skills FROM users LEFT JOIN skills ON users.id = skills.id_users GROUP BY users.id, name, email, users.photo, job_position, company_name, phone, location, role ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectUsers = (id) => {
  return Pool.query(`SELECT * FROM users WHERE id = '${id}'`);
};

const deleteUsers = (id) => {
  return Pool.query(`DELETE FROM users WHERE id  = '${id}'`);
};

const createUsers = (data) => {
  const {id, name, email, phone, passwordHash, role} = data;
  return Pool.query(`INSERT INTO users(id,name,email,phone,password, role) 
    VALUES ('${id}','${name}','${email}','${phone}','${passwordHash}', '${role}')`);
};

const createRecruiter = (data) => {
  const {id, name, email, job_position, company_name, phone, passwordHash, role} = data;
  return Pool.query(`INSERT INTO users(id,name,email,job_position,company_name,phone,password, role) 
    VALUES ('${id}','${name}','${email}','${job_position}','${company_name}','${phone}','${passwordHash}', '${role}')`);
};

const updateUsers = (data) => {
  const {id, name, job_position, location, description} = data;
  return Pool.query(`UPDATE users SET name = '${name}', job_position = '${job_position}', location = '${location}', description = '${description}' WHERE id = '${id}'`);
};

const updateImgUsers = (data) => {
  const {id, photo} = data;
  return Pool.query(`UPDATE users SET photo = '${photo}' WHERE id = '${id}'`);
};

const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE id= '${id}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE email= '${email}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM users`);
};

module.exports = {
  selectAllUsers,
  selectUsers,
  deleteUsers,
  createUsers,
  createRecruiter,
  updateUsers,
  updateImgUsers,
  findID,
  findEmail,
  countData,
};
