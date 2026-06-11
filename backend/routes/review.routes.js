import express from 'express';
import { addReview, getCompanyReviews } from '../controllers/review.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/')
    .post(authorizeRoles('Student'), addReview);

router.route('/company/:companyId')
    .get(getCompanyReviews);

export default router;
