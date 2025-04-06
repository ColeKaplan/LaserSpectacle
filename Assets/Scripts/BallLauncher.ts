import { PropertyType } from "../SpectaclesSyncKit/Core/PropertyType";
import { StorageProperty } from "../SpectaclesSyncKit/Core/StorageProperty";
import { SyncEntity } from "../SpectaclesSyncKit/Core/SyncEntity";
import { CoroutineManager, waitForSeconds } from "./Coroutine";
import { ScoreUpdater } from "./ScoreUpdater";

@component
export default class BallLauncher extends BaseScriptComponent {
    @input
    private lifetime: number

    @input
    private speed: number

    @input
    hitSound: AudioComponent

    @input
    scoreUpdater: ScoreUpdater

    private syncReady: boolean
    private syncEntity: SyncEntity
    private coroutineManager: CoroutineManager
    private collider: ColliderComponent

    //private owner
    onAwake() {
        try{

        
        this.syncEntity = new SyncEntity(this, null, true, "Session", null)
        this.coroutineManager = new CoroutineManager(this);
        this.collider = this.getSceneObject().getComponent("ColliderComponent");

        this.syncReady = false
        this.syncEntity.notifyOnReady(() => { 
            this.syncReady = true
            const transform: Transform = this.getTransform();
            const positionType = PropertyType.Location;
            const rotationType = PropertyType.Location;
            const scaleType = PropertyType.Location;
            
            const transformProp = StorageProperty.forTransform(
              transform,
              positionType,
              rotationType,
              scaleType
            );
            const positionProp = StorageProperty.forPosition(transform, PropertyType.Location);
            const rotationProp = StorageProperty.forRotation(transform, PropertyType.Location);
            const scaleProp = StorageProperty.forScale(transform, PropertyType.Location);

            this.sceneObject.getTransform().setWorldPosition(positionProp.currentValue)
            this.sceneObject.getTransform().setWorldRotation(rotationProp.currentValue)
            this.sceneObject.getTransform().setWorldScale(scaleProp.currentValue)
         })
        } catch (e) {
            print(e);
        }

        this.collider.onOverlapEnter.add((args) => {
            try {
                const name = args.overlap.collider.getSceneObject().name
                print("collided with: " + name);

                if (name == "World Mesh") {
                    this.hitSound.play(1)
                    this.sceneObject.destroy();
                } else if (name == "SyncTransform") {
                    this.hitSound.play(1)
                    this.scoreUpdater.updateScore()
                    this.sceneObject.destroy();
                }


            } catch (e) {
                print(e);
            }
        });

        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate();
        });

        this.createEvent("OnEnableEvent").bind(() => {
            this.onEnable();
        });
        // print("Laser Awake")
        //this.destroySelf();
    }

    onEnable() {
        // print("Laser Instance Enabled")
        this.destroySelf();
    }

    onUpdate() {
        // print("Laser Update")
        // if (this.syncReady) {
            let trans = this.getTransform();
            let nextPos = trans.getWorldPosition().add(trans.forward.uniformScale(this.speed));
            trans.setWorldPosition(nextPos);

            // const positionProp = StorageProperty.forPosition(trans, PropertyType.Location);
            // const rotationProp = StorageProperty.forRotation(trans, PropertyType.Location);
            // const scaleProp = StorageProperty.forScale(trans, PropertyType.Location);

            // this.sceneObject.getTransform().setWorldPosition(positionProp.currentValue)
            // this.sceneObject.getTransform().setWorldRotation(rotationProp.currentValue)
            // this.sceneObject.getTransform().setWorldScale(scaleProp.currentValue)
        // }
    }

    destroySelf() {
        const coroutine = function* (sceneObject: SceneObject) {
            yield* waitForSeconds(5);
            // print("destroyed")
            sceneObject.destroy();
        };

        this.coroutineManager.startCoroutine(coroutine, this.sceneObject);
    }
}