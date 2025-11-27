"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyUiDialogConfigCoder = void 0;
const coder_1 = require("./coder");
class AdaptyUiDialogConfigCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            primaryActionTitle: {
                key: 'default_action_title',
                required: true,
                type: 'string',
            },
            secondaryActionTitle: {
                key: 'secondary_action_title',
                required: false,
                type: 'string',
            },
            title: {
                key: 'title',
                required: false,
                type: 'string',
            },
            content: {
                key: 'content',
                required: false,
                type: 'string',
            },
        };
    }
}
exports.AdaptyUiDialogConfigCoder = AdaptyUiDialogConfigCoder;
//# sourceMappingURL=adapty-ui-dialog-config.js.map