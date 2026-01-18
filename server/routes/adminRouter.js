import express from 'express'
import { isAdminAuth, adminLogin, adminLogout } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';


const AdminRouter = express.Router();

AdminRouter.post('/login', adminLogin);
AdminRouter.post('/logout', adminLogout);
AdminRouter.get('/is-auth', authenticateAdmin, isAdminAuth);


export default AdminRouter;