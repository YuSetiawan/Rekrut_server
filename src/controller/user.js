const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const authHelper = require('../helper/auth');
const commonHelper = require('../helper/common');
const cloudinary = require('../middlewares/cloudinary');
const crypto = require('crypto');
let {
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
  createUserVerification,
  checkUserVerification,
  cekUser,
  deleteUserVerification,
  updateAccountVerification,
} = require('../model/user');
const sendEmailUser = require('../middlewares/sendEmailUser');

let userController = {
  getAllUser: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || 'name';
      const sort = req.query.sort || 'ASC';
      let result = await selectAllUsers({limit, offset, sort, sortby});
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, 'Get User Data Success', pagination);
    } catch (err) {
      console.log(err);
    }
  },

  getselectUsers: async (req, res) => {
    const id = String(req.params.id);
    selectUsers(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'Get User Detail Success');
      })
      .catch((err) => res.send(err));
  },

  registerUser: async (req, res) => {
    let {name, email, phone, password, role} = req.body;
    const {rowCount} = await findEmail(email);
    if (rowCount) {
      return res.json({message: 'Email is already taken'});
    }
    const passwordHash = bcrypt.hashSync(password);
    const id = uuidv4();

    const schema = Joi.object().keys({
      name: Joi.required(),
      email: Joi.string().required(),
      phone: Joi.any(),
      password: Joi.string().min(3).max(15).required(),
      role: Joi.required(),
    });
    const {error, value} = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }

    const verify = 'false';
    const users_verification_id = uuidv4().toLocaleLowerCase();
    const users_id = id;
    const token = crypto.randomBytes(64).toString('hex');
    const url = `${process.env.BASE_URL}user/verify?id=${users_id}&token=${token}`;

    await sendEmailUser(name, email, 'Email Verification for Peworld Account', url);

    const data = {
      id,
      name,
      email,
      phone,
      passwordHash,
      role,
      verify,
    };

    createUsers(data);

    await createUserVerification(users_verification_id, users_id, token)
      .then((result) => commonHelper.response(res, result.rows, 201, 'Register Success'))
      .catch((err) => res.send(err));
  },

  registerRecruiter: async (req, res) => {
    let {name, email, phone, job_position, company_name, password, role} = req.body;
    const {rowCount} = await findEmail(email);
    if (rowCount) {
      return res.json({message: 'Email is already taken'});
    }
    const passwordHash = bcrypt.hashSync(password);
    const id = uuidv4();
    const data = {
      id,
      name,
      email,
      job_position,
      company_name,
      phone,
      passwordHash,
      role,
    };

    const schema = Joi.object().keys({
      name: Joi.required(),
      email: Joi.string().required(),
      phone: Joi.any(),
      job_position: Joi.required(),
      company_name: Joi.required(),
      password: Joi.string().min(3).max(15).required(),
      role: Joi.required(),
    });
    const {error, value} = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }

    createRecruiter(data)
      .then((result) => commonHelper.response(res, result.rows, 201, 'Register Success'))
      .catch((err) => res.send(err));
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === 'string' && typeof queryToken === 'string') {
        const checkUsersVerify = await findID(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(res, null, 403, 'Error users has not found');
        }

        if (checkUsersVerify.rows[0].verify != 'false') {
          return commonHelper.response(res, null, 403, 'Users has been verified');
        }

        const result = await checkUserVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(res, null, 403, 'Error invalid credential verification');
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteUserVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, 'Users verified succesful');
        }
      } else {
        return commonHelper.response(res, null, 403, 'Invalid url verification');
      }
    } catch (error) {
      console.log(error);
    }
  },

  updateUsers: async (req, res) => {
    try {
      const {name, job_position, location, description} = req.body;
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      const data = {
        id,
        name,
        job_position,
        location,
        description,
      };

      updateUsers(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Update Users Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateImgUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const photo = result.secure_url;

      const data = {
        id,
        photo,
      };

      updateImgUsers(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Update Users Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      deleteUsers(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Delete Users Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginUser: async (req, res) => {
    let {email, password} = req.body;
    const {
      rows: [user],
    } = await findEmail(email);
    if (!user) {
      return res.json({message: 'Email is incorrect!'});
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.json({message: 'Password is incorrect!'});
    }
    const {
      rows: [verify],
    } = await cekUser(email);
    if (verify.verify === 'false') {
      return res.json({
        message: 'Account is unverify, please check your email for verification.',
      });
    }
    const payload = {
      email: user.email,
      role: user.role,
    };
    user.token = authHelper.generateToken(payload);
    user.refreshToken = authHelper.generateRefreshToken(payload);

    commonHelper.response(res, user, 201, 'login is successful');
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      users_email: decoded.users_email,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = userController;
