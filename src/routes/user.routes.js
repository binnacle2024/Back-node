import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {getUsers,getUser,getUsersPending,updateAcceptedUser,updateRejectedUser, updateUser, getUserExist} from '../controllers/users.controller.js'

const router = Router();

router.get('/users/exist/:user', getUserExist);
router.get('/users', authRequired, getUsers);
router.get('/user/:id', authRequired, getUser);
router.get('/users/pending',authRequired, getUsersPending);
router.put('/users/accepted/:id', authRequired, updateAcceptedUser);
router.put('/users/rejected/:id', authRequired, updateRejectedUser);
router.put('/users/:id', authRequired, updateUser);

export default router;