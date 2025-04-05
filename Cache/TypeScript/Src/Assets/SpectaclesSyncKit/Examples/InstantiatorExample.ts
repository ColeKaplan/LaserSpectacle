import {Instantiator} from "../Components/Instantiator"
import { NetworkRootInfo } from "../Core/NetworkRootInfo"
import {SyncKitLogger} from "../Utils/SyncKitLogger"

@component
export class InstantiatorExample extends BaseScriptComponent {
  private readonly log: SyncKitLogger = new SyncKitLogger(
    InstantiatorExample.name
  )

  @input()
  instantiator: Instantiator

  @input()
  prefab: ObjectPrefab

  onAwake() {
    this.instantiator.notifyOnReady(() => {
      this.onReady()
    })
  }

  onReady() {
    this.instantiator.instantiate(
      this.prefab,
      {},
      (networkRootInfo: NetworkRootInfo) => {
        const newObj = networkRootInfo.instantiatedObject;
        print('Cole instantiated new object: ' + newObj);
      }
    );
  }
}
