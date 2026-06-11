import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import { Student } from './models/student.model.js';
import { Company } from './models/company.model.js';
import { Recruiter } from './models/recruiter.model.js';
import { Job } from './models/job.model.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();
    await Recruiter.deleteMany();
    await Job.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Admin
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@campusconnect.com',
      password: 'password123',
      role: 'Admin',
      isVerified: true
    });

    // 2. Create Placement Officer
    const poUser = await User.create({
      firstName: 'Placement',
      lastName: 'Officer',
      email: 'po@campusconnect.com',
      password: 'password123',
      role: 'PlacementOfficer',
      isVerified: true
    });

    // 3. Create Student
    const studentUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'student@campusconnect.com',
      password: 'password123',
      role: 'Student',
      isVerified: true
    });

    await Student.create({
      userId: studentUser._id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      academicDetails: {
        cgpa: 8.5,
        branch: 'Computer Science',
        graduationYear: 2026
      },
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript']
    });

    // 4. Create Company
    const company = await Company.create({
      name: 'Tech Innovations Inc',
      website: 'https://techinnovations.com',
      industry: 'Software',
      location: 'San Francisco, CA'
    });

    // 5. Create Recruiter
    const recruiterUser = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'recruiter@techinnovations.com',
      password: 'password123',
      role: 'Recruiter',
      isVerified: true
    });

    await Recruiter.create({
      userId: recruiterUser._id,
      firstName: 'Jane',
      lastName: 'Smith',
      companyId: company._id,
      designation: 'Senior Technical Recruiter'
    });

    // 6. Create Job
    await Job.create({
      companyId: company._id,
      recruiterId: recruiterUser._id,
      title: 'Full Stack Developer',
      description: 'Looking for a passionate Full Stack Developer with MERN stack experience.',
      requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
      location: 'Remote',
      salary: {
        min: 80000,
        max: 120000,
        currency: 'USD'
      },
      role: 'SDE',
      status: 'Open',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    console.log('Database seeded successfully!');
    console.log('--- Test Accounts (Password for all: password123) ---');
    console.log('Admin: admin@campusconnect.com');
    console.log('PO: po@campusconnect.com');
    console.log('Student: student@campusconnect.com');
    console.log('Recruiter: recruiter@techinnovations.com');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
