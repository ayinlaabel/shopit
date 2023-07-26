import { Request, Response } from 'express';
const bcrypt = require('bcrypt');

import { Customers } from '../../database/models';
import { CustomerValidator } from '../../validator';
import { customer } from '../../interface';

exports.createCustomerAccounnt = async (
  req: Request,
  res: Response,
  next: any
) => {
  let { firstname, lastname, email, password } = req.body;

  const { error, value } = await CustomerValidator({
    firstname,
    lastname,
    email,
    password,
  });
  if (error) res.status(400).jsonp(error);

  const existingCustomer = await Customers.findOne({ email });

  if (!existingCustomer) {
    const hashPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customers({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    newCustomer
      .save()
      .then((data: any) =>
        res.status(201).jsonp({
          status: 'SUCCESS',
          message: 'Account created successfully',
          data: data,
        })
      )
      .catch((err: any) =>
        res.status(400).jsonp({
          status: 'FAILED',
          message: 'Something went wrong.',
          data: err,
        })
      );
  } else {
    res.status(400).jsonp({
      status: 'FAILED',
      message: `User with ${email} already exiting`,
      data: '',
    });
  }
};

exports.customerLogin = async (req: Request, res: Response, next: any) => {
  let { email, password } = req.body;

  Customers.findOne({ email }).then(async (customer: any) => {
    if (!customer)
      res
        .status(400)
        .jsonp({ status: 'FAILED', message: 'No Customer Found.' });

    let hash = await bcrypt.compare(password, customer.password);
    if (!hash)
      res
        .status(400)
        .jsonp({ status: 'FAILED', message: 'Incorrect password, try again.' });
    else
      customer.createSession().then((refreshToken: any) => {
        //Session created successfully - refreshToken returned.
        //now we generate an access auth token for the user.
        return customer
          .generateAccessAuthToken()
          .then((accessToken: any) => {
            //access auth token generated successfully, now we return an object containing  the auth token
            return { accessToken, refreshToken };
          })
          .then((authToken: any) => {
            //Now we construct and send  the response to the user with their auth tokens in the header and the user object in the body
            res.status(200).jsonp({
              status: 'SUCCESS',
              message: 'Login successfull',
              data: customer,
              token: authToken.accessToken,
            });
          });
      });
  });
};
