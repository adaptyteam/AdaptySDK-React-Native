import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiDialogConfig } from '../ui/types';
type Model = AdaptyUiDialogConfig;
type Serializable = Def['AdaptyUI.DialogConfiguration'];
export declare class AdaptyUiDialogConfigCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-ui-dialog-config.d.ts.map