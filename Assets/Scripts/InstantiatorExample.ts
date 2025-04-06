import { PlayerPositionUpdater } from "./PlayerPositionUpdater"
import {Instantiator} from "../SpectaclesSyncKit/Components/Instantiator"
import { NetworkRootInfo } from "../SpectaclesSyncKit/Core/NetworkRootInfo"
import {SyncKitLogger} from "../SpectaclesSyncKit/Utils/SyncKitLogger"

@component
export class InstantiatorExample extends BaseScriptComponent {
  private readonly log: SyncKitLogger = new SyncKitLogger(
    InstantiatorExample.name
  )

  @input()
  instantiator: Instantiator

  @input()
  prefab: ObjectPrefab

  @input()
  updaterScript: PlayerPositionUpdater

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
        newObj.getTransform().setWorldScale(newObj.getTransform().getWorldScale().mult(new vec3(8,80,8)))
        newObj.getTransform().setWorldPosition(newObj.getTransform().getWorldPosition().add(new vec3(0,-100,0)))
        this.updaterScript.registerCollider(newObj);
        print('Cole instantiated new object: ' + newObj);
      }
    );
  }
}
