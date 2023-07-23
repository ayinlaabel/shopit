const customerSchema = mongoose.Schema({
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

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer };
