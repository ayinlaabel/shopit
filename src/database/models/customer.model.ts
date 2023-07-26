// Import mongoose and its types
import mongoose, { Schema, Document } from 'mongoose';
import { customer } from '../../interface';
import { x } from 'joi';
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const jwtSecret = process.env.JWTSECRET;

const customerSchema: Schema<customer> = new Schema<customer>({
  firstname: {
    type: String,
    required: [true, 'First Name is required.'],
  },
  lastname: {
    type: String,
    required: [true, 'Last Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is reequired.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

customerSchema.methods.toJSON = function () {
  const customer = this;
  const customerObject = customer.toObject();

  //return the document except the password and session are bad (these shouldn't be made available)
  return _.omit(customerObject, ['password', 'sessions']);
};

customerSchema.methods.generateAccessAuthToken = function () {
  const customer = this;
  return new Promise((resolve, reject) => {
    //create the JSON Web Token and return that
    jwt.sign(
      {
        customerInfo: {
          _id: customer._id.toHexString(),
          roles: customer.roles,
        },
      },
      jwtSecret,
      { expiresIn: '2h' },
      (err: any, token: any) => {
        if (!err) {
          resolve(token);
        } else {
          reject();
        }
      }
    );
  });
};

customerSchema.methods.generateRefreshAuthToken = function () {
  //these method simply generates a 64bytes hex string - it doesn't save it to the database. saveSessionToDatabase() does that.
  return new Promise((resolve, reject) => {
    //using crypto to create random 64bytes hex string
    crypto.randomBytes(64, (err: any, buf: any) => {
      if (!err) {
        let token = buf.toString('hex');

        return resolve(token);
      }
    });
  });
};

customerSchema.methods.createSession = function () {
  let customer = this;

  return customer
    .generateRefreshAuthToken()
    .then((refreshToken: any) => {
      return saveSessionToDatabase(customer, refreshToken);
    })
    .then((refreshToken: any) => {
      //saved to database successfully
      //now return the refreshToken
      return refreshToken;
    })
    .catch((err: any) => {
      return Promise.reject('failed to save session to database.\n' + err);
    });
};

//** MODEL METHODS (Static Method)*/
customerSchema.statics.getJwtSecret = () => {
  return process.env.JWTSECRET;
};

customerSchema.statics.getCustomerId = () => {
  return localStorage.getItem('customerId');
};
customerSchema.statics.findByIdAndToken = function (_id, token) {
  //find customer by  _id and token
  //use in auth middleware (verifySession)

  let customer = this;

  return customer.findOne({
    _id,
    'sessions.token': token,
  });
};

customerSchema.statics.findByCredentials = function (email, password) {
  let customer = this;

  return customer
    .findOne({ email })
    .then((customer: any) => {
      if (!customer) {
        return { status: 'FAILED', error: 'No customer found!' };
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, customer.password, (err: any, res: any) => {
          if (res) resolve(customer);
          else {
            return { status: 'FAILED', error: 'Wrong password' };
          }
        });
      });
    })
    .catch((err: any) => {
      throw err;
    });
};

customerSchema.statics.findById = function (_id: any) {
  let customer = this;

  return customer
    .findOne({ _id })
    .then((customer: any) => {
      console.log(customer);
      return customer;
    })
    .catch((err: any) => console.log(err));
};

customerSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;

  if (expiresAt > secondsSinceEpoch) {
    //hasn't expired
    return false;
  } else {
    //has expired
    return true;
  }
};

//** MIDDLEWARE */
customerSchema.pre('save', function (next) {
  let customer = this;
  let costFactor = 10;

  if (customer.isModified('password')) {
    //if the password field is edited/changed then run this code.
    //Generate salt and hash password
    bcrypt.genSalt(costFactor, (err: any, salt: any) => {
      bcrypt.hash(customer.password, salt, (err: any, hash: any) => {
        customer.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//** HELPER METHODS */

let saveSessionToDatabase = (customer: any, refreshToken: any) => {
  //save sessions to database
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    customer.sessions.push({ token: refreshToken, expiresAt });

    customer
      .save()
      .then(() => {
        //saved session successfully
        return resolve(refreshToken);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

let generateRefreshTokenExpiryTime = () => {
  // let daysUntilExpire = process.env.REFRESH_TOKEN_DAYS_UNTIL_EXPIRE;
  let daysUntilExpire: any = '10';
  let secondsUtilExpire = daysUntilExpire * 24 * 60 * 60;
  return Date.now() / 1000 + secondsUtilExpire;
};

const Customers = mongoose.model('Customers', customerSchema);

export default Customers;
