import { Router } from 'express';
import { 
    getStudentProfile, 
    updateStudentProfile, 
    getAllStudents 
} from '../controllers/student.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(verifyJWT);

// Student only routes
router.route('/profile')
    .get(authorizeRoles('Student'), getStudentProfile)
    .put(
        authorizeRoles('Student'),
        upload.fields([
            { name: "profilePicture", maxCount: 1 },
            { name: "resume", maxCount: 1 }
        ]),
        updateStudentProfile
    );

// Recruiter and PO routes
router.route('/')
    .get(authorizeRoles('Recruiter', 'PlacementOfficer', 'Admin'), getAllStudents);

export default router;
