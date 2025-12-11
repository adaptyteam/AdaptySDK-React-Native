import * as Input from '../types/inputs';
type Model = Input.IdentifyParamsInput;
type Serializable = {
    app_account_token?: string;
    obfuscated_account_id?: string;
    obfuscated_profile_id?: string;
};
export declare class AdaptyIdentifyParamsCoder {
    encode(params?: Model): Serializable | undefined;
}
export {};
//# sourceMappingURL=adapty-identify-params.d.ts.map