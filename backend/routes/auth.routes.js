import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser,
    verifyEmail 
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify-email/:token').get(verifyEmail);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/me').get(verifyJWT, getCurrentUser);

export default router;
