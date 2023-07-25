// Import mongoose and its types
import mongoose, { Schema, Document } from 'mongoose';
import { customer } from '../../interface';

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
});

const Customers = mongoose.model('Customers', customerSchema);

export default Customers;
