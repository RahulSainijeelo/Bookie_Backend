"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = require("../middleware/validation.middleware");
const lead_validation_1 = require("../validations/lead.validation");
const leads_controller_1 = require("../controllers/leads.controller");
const router = (0, express_1.Router)();
router.get("/", leads_controller_1.leadController.getLeads);
router.post('/', (0, validation_middleware_1.validate)(lead_validation_1.createLeadSchema), leads_controller_1.leadController.createLead.bind(leads_controller_1.leadController));
router.delete('/:id', leads_controller_1.leadController.deleteLead.bind(leads_controller_1.leadController));
exports.default = router;
//# sourceMappingURL=leads.route.js.map