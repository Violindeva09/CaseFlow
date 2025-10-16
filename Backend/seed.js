require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Case = require('./models/Case');
const connectDB = require('./config/db');

async function seed() {
  await connectDB(process.env.MONGO_URI);

  await User.deleteMany({});
  await Case.deleteMany({});

  const agents = [
    { username: 'agent01', name: 'Agent 1', passwordHash: await require('bcryptjs').hash('pass123', 10), role: 'agent', skills: ['network','billing'], capacity: 4 },
    { username: 'agent02', name: 'Agent 2', passwordHash: await require('bcryptjs').hash('pass123', 10), role: 'agent', skills: ['hardware','premium'], capacity: 3 }
  ];
  const citizens = [
    { username: 'citizen01', name: 'Citizen 1', passwordHash: await require('bcryptjs').hash('pass123', 10), role: 'citizen', skills: [] }
  ];
  const admins = [
    { username: 'admin', name: 'Admin User', passwordHash: await require('bcryptjs').hash('pass123', 10), role: 'admin', skills: [] }
  ];
  const supervisors = [
    { username: 'supervisor01', name: 'Supervisor 1', passwordHash: await require('bcryptjs').hash('pass123', 10), role: 'supervisor', skills: [] }
  ];
  const agentDocs = await User.insertMany(agents);
  const citizenDocs = await User.insertMany(citizens);
  const adminDocs = await User.insertMany(admins);
  const supervisorDocs = await User.insertMany(supervisors);

  const now = new Date();
  const cases = [
    { title: 'Network Issue', description: 'Cannot connect to internet', priority: 'high', topic: 'network', tier: 'standard', slaDeadline: new Date(now.getTime() + 3600*1000), customerId: citizenDocs[0]._id },
    { title: 'Billing Dispute', description: 'Wrong charge on invoice', priority: 'medium', topic: 'billing', tier: 'premium', slaDeadline: new Date(now.getTime() + 3600*2000), customerId: citizenDocs[0]._id }
  ];
  await Case.insertMany(cases);

  console.log('Demo users and cases created!');
  mongoose.disconnect();
}

seed();
