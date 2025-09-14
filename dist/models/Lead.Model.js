"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LeadSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: String,
    email: { type: String, required: true },
    altEmail: String,
    status: { type: String, default: 'New' },
    qualification: { type: String, default: 'High School' },
    interestField: { type: String, default: 'Web Development' },
    source: { type: String, default: 'Website' },
    assignedTo: { type: String, required: true },
    jobInterest: String,
    state: String,
    city: String,
    passoutYear: Number,
    heardFrom: String,
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Lead', LeadSchema);
//# sourceMappingURL=Lead.Model.js.map