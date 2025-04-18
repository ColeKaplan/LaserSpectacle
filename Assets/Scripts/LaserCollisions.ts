import { InteractorInputType } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Core/Interactor/Interactor";
import WorldCameraFinderProvider from "../SpectaclesSyncKit/SpectaclesInteractionKit/Providers/CameraProvider/WorldCameraFinderProvider";
import { SIK } from "../SpectaclesSyncKit/SpectaclesInteractionKit/SIK";
import { CoroutineManager, waitForSeconds } from "./Coroutine"
import { ScoreUpdater } from "./ScoreUpdater";

@component
export class LaserCollisions extends BaseScriptComponent {

    @input
    laserSound: AudioComponent

    @input
    scoreUpdater: ScoreUpdater

    coroutineManager!: any;
    onAwake() {
        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate()
        });

        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });

        this.coroutineManager = new CoroutineManager(this);
    }


    onStart() {
        // print("laser created")
        // this.destroySelf();

        this.sceneObject.getComponent("Physics.ColliderComponent").onOverlapEnter.add((e) => {

            var overlap = e.overlap;
            let isPersonHit = false;

            let closestHit = null;
            let wCamera = WorldCameraFinderProvider.getInstance().getWorldPosition()
            let hitObject: SceneObject = null
            try {
                e.currentOverlaps.forEach(contact => {
                    // print("TYPE NAME: " + contact.getTypeName())
                    let objectHit = contact.collider.getSceneObject()
                    // print("name: " + objectHit.name)
                    let objectHitT = objectHit.getTransform()

                    try {
                        if (objectHit.name == "LaserPlane") {
                            // print("hit another laser")
                        } else if (objectHit.name == "World Transform") {
                            print("hit world transform")

                        } else if (objectHit.name == "Player") {
                            print("hit cyllinder")
                            print("cyllinder id: " + contact.id)
                            if (this.laserSound) {
                                this.laserSound.play(1.0);
                            }

                            isPersonHit = true

                            if (closestHit == null) {
                                hitObject = overlap.collider.getSceneObject()
                                closestHit = contact.collider.sceneObject.getTransform().getWorldPosition()
                                // print("closest hit: " + closestHit)
                                // print(hitObject.name)
                            }
                            else {
                                if (contact.collider.sceneObject.getTransform().getWorldPosition().distance(wCamera) < closestHit.distance(wCamera)) {
                                    closestHit = contact.collider.sceneObject.getTransform().getWorldPosition()
                                    hitObject = contact.collider.getSceneObject()
                                }
                            }

                            let interactionManager = SIK.InteractionManager;
                            let handInteractor = interactionManager.getInteractorsByType(
                                InteractorInputType.LeftHand
                            )[0];
                            const handPosition = handInteractor.startPoint;
                            const distance = handPosition.distance(closestHit)
                            this.sceneObject.getTransform().setWorldScale(new vec3(1, 1, distance))
                            // this.sceneObject.getTransform().setWorldPosition(handPosition)

                            this.sceneObject.destroy()
                        }
                    } catch (error) {
                        print("first error line: " + error)
                    }
                })
            }
            catch (error) {
                print("second error line: " + error)
            }

            if (isPersonHit) {
                this.scoreUpdater.updateScore()
            }
        });
    }

    destroySelf() {
        const coroutine = function* (sceneObject: SceneObject) {
            yield* waitForSeconds(5);
            // print("destroyed")
            sceneObject.destroy();
        };

        this.coroutineManager.startCoroutine(coroutine, this.sceneObject);
    }

    onUpdate() {
    }
}
