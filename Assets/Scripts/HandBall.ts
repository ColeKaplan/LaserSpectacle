import { SIK } from "../SpectaclesSyncKit/SpectaclesInteractionKit/SIK";
import { InteractorInputType } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Core/Interactor/Interactor";
import { Instantiator } from "../SpectaclesSyncKit/Components/Instantiator"
import { NetworkRootInfo } from "../SpectaclesSyncKit/Core/NetworkRootInfo";

@component
export class HandBall extends BaseScriptComponent {
    // Define a public variable for your target object
    @input()
    public laserObject: ObjectPrefab;

    // Add input for laser sound
    @input()
    public laserSound: AudioComponent;

    @input()
    instantiator: Instantiator

    // Add input for device tracking
    @input()
    public deviceTracking: DeviceTracking;

    private canInstantiate: boolean

    onAwake() {
        // Hide the object initially
        if (this.laserObject) {
            //this.laserObject.enabled = false;
        }

        this.instantiator.notifyOnReady(() => {
            this.canInstantiate = true
        })

        // Set up pinch detection
        this.setupPinchDetection();
    }

    setupPinchDetection() {
        let handInputData = SIK.HandInputData;
        let leftHand = handInputData.getHand("left");
        let rightHand = handInputData.getHand("right");

        rightHand.onPinchDown.add(() => {
            if (this.laserObject) {
                this.fireLaser();
            }
        });
    }

    fireLaser() {

        let interactionManager = SIK.InteractionManager;
        let handInteractor = interactionManager.getInteractorsByType(InteractorInputType.RightHand)[0];

        if (!handInteractor) return;

        // let laserInstance = this.sceneObject.copyWholeHierarchy(this.laserObject);
        // laserInstance.setParent(this.laserObject.getParent());
        if (this.canInstantiate) {
            this.instantiator.instantiate(
                this.laserObject,
                {},
                (networkRootInfo: NetworkRootInfo) => {
                    const newObj = networkRootInfo.instantiatedObject;
                    newObj.getTransform().setWorldScale(newObj.getTransform().getWorldScale().mult(new vec3(8, 8, 8)))
                    print('Cole instantiated new object: ' + newObj);

                    const handPosition = handInteractor.startPoint;
                    const cursorPosition = handInteractor.endPoint;
                    const direction = cursorPosition.sub(handPosition).normalize();

                    const transform = newObj.getTransform();
                    transform.setWorldPosition(handPosition);

                    const forward = vec3.forward();
                    const rotationAxis = forward.cross(direction).normalize();
                    const angle = forward.angleTo(direction);
                    const rotation = quat.angleAxis(angle, rotationAxis);
                    transform.setWorldRotation(rotation);
                    newObj.enabled = true;

                    if (this.laserSound) {
                        this.laserSound.play(1)
                    }
                    print("laser fired");
                }
            );
        }

    }
}