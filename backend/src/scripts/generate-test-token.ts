import jwt from 'jsonwebtoken';

const payload = {
  id: 'test-instructor-id',
  role: 'instructor'
};

const token = jwt.sign(payload, "83n1jksdbnajkBNiads!@3");
console.log('Test JWT Token:');
console.log(token); 