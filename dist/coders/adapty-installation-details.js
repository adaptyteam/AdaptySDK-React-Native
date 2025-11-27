"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyInstallationDetailsCoder = void 0;
const date_1 = require("./date");
class AdaptyInstallationDetailsCoder {
    encode(model) {
        const result = {
            install_time: new date_1.DateCoder().encode(model.installTime),
            app_launch_count: model.appLaunchCount,
        };
        if (model.installId) {
            result.install_id = model.installId;
        }
        if (model.payload) {
            result.payload = model.payload;
        }
        return result;
    }
    decode(json) {
        return {
            installTime: new date_1.DateCoder().decode(json.install_time),
            appLaunchCount: json.app_launch_count,
            installId: json.install_id,
            payload: json.payload,
        };
    }
}
exports.AdaptyInstallationDetailsCoder = AdaptyInstallationDetailsCoder;
//# sourceMappingURL=adapty-installation-details.js.map