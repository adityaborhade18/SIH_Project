import express from 'express'
import { isAdminAuth, adminLogin } from '../controllers/adminController.js';


const AdminRouter= express.Router();

AdminRouter.post('/login', adminLogin);
AdminRouter.get('/is-auth',isAdminAuth);


export default AdminRouter;