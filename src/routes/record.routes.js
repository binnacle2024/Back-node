import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {createRecords,deleteRecords,getRecord,getRecords,updateRecords, getRecordsDate} from '../controllers/records.controller.js'

const router = Router();

router.get('/records', authRequired, getRecords);
router.get('/records/:id', authRequired, getRecord);
router.post('/records', authRequired, createRecords);
router.delete('/records/:id', authRequired, deleteRecords);
router.put('/records/:id', authRequired, updateRecords);
router.get('/records/date/:from/:to', authRequired, getRecordsDate);

export default router;