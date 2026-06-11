import { Router } from 'express';
import { createJob, getJobs, getJobById, updateJob } from '../controllers/job.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
    .get(getJobs)
    .post(verifyJWT, authorizeRoles('Recruiter'), createJob);

router.route('/:id')
    .get(getJobById)
    .put(verifyJWT, authorizeRoles('Recruiter', 'Admin'), updateJob);

export default router;
