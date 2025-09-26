"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyInstallationStatusCoder = void 0;
const date_1 = require("./date");
class AdaptyInstallationStatusCoder {
    encode(model) {
        if (model.status === 'determined') {
            const details = {
                install_time: new date_1.DateCoder().encode(model.details.installTime),
                app_launch_count: model.details.appLaunchCount,
            };
            if (model.details.installId) {
                details.install_id = model.details.installId;
            }
            if (model.details.payload) {
                details.payload = model.details.payload;
            }
            return {
                status: 'determined',
                details,
            };
        }
        return {
            status: model.status,
        };
    }
    decode(json) {
        if (json.status === 'determined') {
            const details = {
                installTime: new date_1.DateCoder().decode(json.details.install_time),
                appLaunchCount: json.details.app_launch_count,
                installId: json.details.install_id,
                payload: json.details.payload,
            };
            return {
                status: 'determined',
                details,
            };
        }
        return {
            status: json.status,
        };
    }
}
exports.AdaptyInstallationStatusCoder = AdaptyInstallationStatusCoder;
//# sourceMappingURL=adapty-installation-status.js.map