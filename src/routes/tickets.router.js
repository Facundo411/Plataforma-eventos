import { Router } from "express";
import {createTicket, getMyTickets, cancelTicket, getTicketsByEvent} from "../controllers/tickets.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.post("/events/:eid/tickets", authenticate, createTicket);

router.get("/tickets/my-tickets", authenticate, getMyTickets);

router.get("/events/:eid/tickets", authenticate, authorize("organizer", "admin"), getTicketsByEvent);

router.patch("/tickets/:tid/cancel", authenticate, cancelTicket);

export default router;