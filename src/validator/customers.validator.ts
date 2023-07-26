import Joi from 'joi';
import { customer } from '../interface';

const validator = (schema: any) => (payload: customer) =>
  schema.validate(payload, { abortEarly: false });

const CustomerSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required(),
});

const CustomerValidator = validator(CustomerSchema);

export default CustomerValidator;
