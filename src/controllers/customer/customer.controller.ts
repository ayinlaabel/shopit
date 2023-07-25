import { Request, Response } from 'express';
const bcrypt = require('bcrypt');

import { Customers } from '../../database/models';
import { CustomerValidator } from '../../validator';

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
  }
};

