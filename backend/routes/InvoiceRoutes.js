import express from "express"
import { createInvoice, deleteInvoice, getInvoiceById, getInvoices, updateInvoice } from "../controllers/InvoiceController.js"
import authMiddlware from "../middleware/AuthMiddleware.js";
const router = express.Router()

router.use(authMiddlware);  


router.post('/createInvoice',createInvoice)
router.get('/',getInvoices)
router.get('/:id',getInvoiceById)
router.put("/:id",updateInvoice)
router.delete("/:id",deleteInvoice)

export default router