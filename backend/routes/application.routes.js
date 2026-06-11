import { Router } from 'express';
import { 
    applyForJob, 
    getStudentApplications, 
    getJobApplications, 
    updateApplicationStatus 
} from '../controllers/application.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/student').get(authorizeRoles('Student'), getStudentApplications);
router.route('/job/:jobId').post(authorizeRoles('Student'), applyForJob);
router.route('/job/:jobId/applicants').get(authorizeRoles('Recruiter', 'PlacementOfficer', 'Admin'), getJobApplications);
router.route('/:id/status').put(authorizeRoles('Recruiter', 'PlacementOfficer', 'Admin'), updateApplicationStatus);

export default router;
