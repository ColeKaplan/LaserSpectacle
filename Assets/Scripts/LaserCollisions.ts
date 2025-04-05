import { InteractorInputType } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Core/Interactor/Interactor";
import WorldCameraFinderProvider from "../SpectaclesSyncKit/SpectaclesInteractionKit/Providers/CameraProvider/WorldCameraFinderProvider";
import { SIK } from "../SpectaclesSyncKit/SpectaclesInteractionKit/SIK";

@component
export class LaserCollisions extends BaseScriptComponent {
    onAwake() {
        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate()
        });

        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }

    onStart() {

        this.sceneObject.getComponent("Physics.ColliderComponent").onOverlapEnter.add((e) => {
            print("Laser Collision Ocurred")

            var overlap = e.overlap;
            let isPersonHit = false;

            let closestHit = null;
            let wCamera = WorldCameraFinderProvider.getInstance().getWorldPosition()
            let hitObject: SceneObject = null

            e.currentOverlaps.forEach(contact => {
                let objectHit = overlap.collider.getSceneObject()
                print("Collided with object: " + objectHit.name)

                let objectHitT = objectHit.getTransform()

                if (overlap.collider.getSceneObject().name == "CollisionCylinder") {
                    print("hit the cylinder")
                    this.sceneObject.getComponent("AudioComponent").play(1);
                    isPersonHit = true
                }

                if (closestHit == null) {
                    hitObject = overlap.collider.getSceneObject()
                    closestHit = contact.collider.sceneObject.getTransform().getWorldPosition()
                    print("closest hit: " + closestHit)
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

                this.enabled = false
            })

            if (isPersonHit) {
                // this.dartboardController.playDartHitSound()
            }
        });
    }

    onUpdate() {
        print("updating")
    }
}
