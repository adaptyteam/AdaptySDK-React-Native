import { AdaptyFlow } from '@/types';
import { CreateFlowViewParamsInput } from './types';
import { FlowViewController } from './flow-view-controller';

/**
 * Creates a flow view controller.
 * You can use it to further configure a view or present it.
 *
 * @see {@link https://adapty.io/docs/react-native-get-pb-paywalls#fetch-the-view-configuration | [DOC] Creating a flow view}
 *
 * @param {AdaptyFlow} flow - flow that you want to present.
 * @param {CreateFlowViewParamsInput | undefined} [params] - additional params.
 * @returns {Promise<FlowViewController>} FlowViewController — A promise that resolves to a FlowViewController instance.
 *
 * @example
 * ```ts
 * const flow = await adapty.getFlow("MY_PLACEMENT");
 * const view = await createFlowView(flow);
 * // Present with default full-screen style
 * view.present();
 * // Or present with custom style (iOS only)
 * view.present({ iosPresentationStyle: 'page_sheet' }); // or 'full_screen'
 * ```
 *
 * @throws {AdaptyError} — If flow is not found,
 * does not have a no-code view configured
 * or if there is an error while creating a view.
 */
export async function createFlowView(
  flow: AdaptyFlow,
  params: CreateFlowViewParamsInput = {},
): Promise<FlowViewController> {
  const controller = await FlowViewController.create(flow, params);

  return controller;
}
