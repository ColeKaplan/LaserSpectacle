import {Instantiator} from "../Components/Instantiator"
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
    this.log.i("Hi Cole, Ghost should be instantiated")
    this.instantiator.instantiate(this.prefab)
  }
}
