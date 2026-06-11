import express from 'express';
import { createEvent, getEvents, registerForEvent, deleteEvent } from '../controllers/event.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT); // All event routes require authentication

router.route('/')
    .get(getEvents)
    .post(authorizeRoles('PlacementOfficer', 'Admin'), createEvent);

router.route('/:id/register')
    .post(authorizeRoles('Student'), registerForEvent);

router.route('/:id')
    .delete(authorizeRoles('PlacementOfficer', 'Admin'), deleteEvent);

export default router;
