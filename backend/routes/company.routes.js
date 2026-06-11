import { Router } from 'express';
import { registerCompany, getCompanies, getCompanyById } from '../controllers/company.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.route('/')
    .get(getCompanies)
    .post(verifyJWT, upload.single('logo'), registerCompany);

router.route('/:id').get(getCompanyById);

export default router;
