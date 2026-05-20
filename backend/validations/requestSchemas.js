const Joi = require('joi');

const objectId = Joi.string().hex().length(24);
const phone = Joi.string()
  .trim()
  .pattern(/^[+0-9][0-9\s-]{6,19}$/)
  .messages({
    'string.pattern.base': 'phone must be a valid phone number',
  });

const optionalText = (max = 255) => Joi.string().trim().max(max).allow('', null);
const requiredText = (field, max = 100) => Joi.string().trim().min(2).max(max).required().messages({
  'any.required': `${field} is required`,
  'string.empty': `${field} is required`,
});
const updateText = (max = 100) => Joi.string().trim().min(2).max(max);

const authSchemas = {
  register: Joi.object({
    name: requiredText('name', 80),
    email: Joi.string().trim().lowercase().email().max(120).required(),
    password: Joi.string().min(6).max(72).required(),
    phone: phone.required(),
  }),
  login: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }),
};

const carSchemas = {
  create: Joi.object({
    brand: requiredText('brand', 60),
    model: requiredText('model', 80),
    year: Joi.number().integer().min(1980).max(new Date().getFullYear() + 1).required(),
    base_rent_per_day: Joi.number().positive().precision(2).required(),
    location_id: objectId.required(),
    status: Joi.string().valid('available', 'booked', 'maintenance'),
  }),
  update: Joi.object({
    brand: updateText(60),
    model: updateText(80),
    year: Joi.number().integer().min(1980).max(new Date().getFullYear() + 1),
    base_rent_per_day: Joi.number().positive().precision(2),
    location_id: objectId,
    status: Joi.string().valid('available', 'booked', 'maintenance'),
  }).min(1),
};

const driverSchemas = {
  create: Joi.object({
    name: requiredText('name', 80),
    phone: phone.required(),
    license_number: Joi.string().trim().uppercase().min(4).max(40).required(),
    location_id: objectId.required(),
    availability_status: Joi.string().valid('available', 'busy', 'on_leave'),
  }),
  update: Joi.object({
    name: updateText(80),
    phone,
    license_number: Joi.string().trim().uppercase().min(4).max(40),
    location_id: objectId,
    availability_status: Joi.string().valid('available', 'busy', 'on_leave'),
  }).min(1),
};

const locationSchemas = {
  create: Joi.object({
    name: requiredText('name', 100),
    city: requiredText('city', 80),
    address: requiredText('address', 200),
    latitude: Joi.number().min(-90).max(90).allow(null, ''),
    longitude: Joi.number().min(-180).max(180).allow(null, ''),
    phone,
    hours: optionalText(80),
  }),
  update: Joi.object({
    name: updateText(100),
    city: updateText(80),
    address: updateText(200),
    latitude: Joi.number().min(-90).max(90).allow(null, ''),
    longitude: Joi.number().min(-180).max(180).allow(null, ''),
    phone,
    hours: optionalText(80),
  }).min(1),
};

const bookingSchemas = {
  create: Joi.object({
    car_id: objectId.required(),
    driver_id: objectId.allow(null, ''),
    pickup_location_id: objectId.required(),
    return_location_id: objectId.required(),
    start_date: Joi.date().iso().greater('now').required(),
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),
  }),
  updateStatus: Joi.object({
    status: Joi.string()
      .valid('pending_payment', 'payment_submitted', 'confirmed', 'completed', 'cancelled')
      .required(),
  }),
};

const paymentSchemas = {
  submit: Joi.object({
    booking_id: objectId.required(),
    payment_method: Joi.string().valid('Cash', 'JazzCash', 'Easypaisa').required(),
    amount: Joi.number().positive().precision(2).required(),
  }),
};

const pricingSchemas = {
  create: Joi.object({
    car_id: objectId.required(),
    date_from: Joi.date().iso().required(),
    date_to: Joi.date().iso().greater(Joi.ref('date_from')).required(),
    multiplier: Joi.number().positive().max(10).precision(2).required(),
    reason: optionalText(120),
  }),
  update: Joi.object({
    date_from: Joi.date().iso(),
    date_to: Joi.date().iso(),
    multiplier: Joi.number().positive().max(10).precision(2),
    reason: optionalText(120),
  }).min(1),
};

const reviewSchemas = {
  create: Joi.object({
    car_id: objectId.required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().min(3).max(1000).required(),
  }),
  update: Joi.object({
    rating: Joi.number().integer().min(1).max(5),
    comment: Joi.string().trim().min(3).max(1000),
  }).min(1),
};

module.exports = {
  authSchemas,
  carSchemas,
  driverSchemas,
  locationSchemas,
  bookingSchemas,
  paymentSchemas,
  pricingSchemas,
  reviewSchemas,
};
