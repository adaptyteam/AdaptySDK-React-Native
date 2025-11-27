import * as Input from '../types/inputs';
import type { Def } from '@/types/schema';
type Model = Input.ActivateParamsInput;
type Serializable = Def['AdaptyConfiguration'];
export declare class AdaptyConfigurationCoder {
    encode(apiKey: string, params: Model): Serializable;
}
export {};
//# sourceMappingURL=adapty-configuration.d.ts.map