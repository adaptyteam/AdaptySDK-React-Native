"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
/**
 * Generates a short unique identifier.
 * Format: 12 lowercase alphanumeric characters
 */
function generateId() {
    let id = '';
    while (id.length < 12) {
        id += Math.random().toString(36).slice(2);
    }
    return id.slice(0, 12);
}
exports.generateId = generateId;
//# sourceMappingURL=generate-id.js.map