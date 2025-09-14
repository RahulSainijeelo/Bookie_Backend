"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadController = exports.LeadController = void 0;
const Lead_Model_1 = __importDefault(require("../models/Lead.Model"));
const lead_validation_1 = require("../validations/lead.validation");
class LeadController {
    async createLead(req, res) {
        try {
            const { body } = lead_validation_1.createLeadSchema.parse({ body: req.body });
            console.log("body in lead", body);
            const newLead = new Lead_Model_1.default(body);
            const savedLead = await newLead.save();
            res.status(201).json({
                success: true,
                data: savedLead,
                message: 'Lead created successfully'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create lead'
            });
        }
    }
    async getLeads(req, res) {
        try {
            const response = await Lead_Model_1.default.find({ isActive: true });
            res.json({
                success: true,
                data: response
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch leads'
            });
        }
    }
    async deleteLead(req, res) {
        try {
            const { id } = req.params;
            const lead = await Lead_Model_1.default.findByIdAndDelete(id);
            if (!lead) {
                return res.status(404).json({
                    success: false,
                    message: 'Lead not found'
                });
            }
            res.json({
                success: true,
                message: 'Lead deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete lead'
            });
        }
    }
}
exports.LeadController = LeadController;
exports.leadController = new LeadController();
//# sourceMappingURL=leads.controller.js.map