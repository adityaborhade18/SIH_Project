import express from 'express'
import { isAdminAuth, adminLogin, adminLogout } from '../controllers/adminController.js';


const AdminRouter = express.Router();

AdminRouter.post('/login', adminLogin);
AdminRouter.post('/logout', adminLogout);
AdminRouter.get('/is-auth', isAdminAuth);


export default AdminRouter;