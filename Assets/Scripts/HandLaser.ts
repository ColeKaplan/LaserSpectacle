import { SIK } from "../SpectaclesSyncKit/SpectaclesInteractionKit/SIK";
import { InteractorInputType } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Core/Interactor/Interactor";
import { HandInputData } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Providers/HandInputData/HandInputData";

@component
export class HandLaser extends BaseScriptComponent {
  // Define a public variable for your target object
  @input()
  public targetObject: SceneObject;

  onAwake() {
    // Hide the object initially
    if (this.targetObject) {
      this.targetObject.enabled = false;
    }

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate();
    });

    // Set up pinch detection
    this.setupPinchDetection();
  }

  setupPinchDetection() {
    // Retrieve HandInputData from SIK's definitions
    let handInputData = SIK.HandInputData;

    // Fetch the TrackedHand for left and right hands
    let leftHand = handInputData.getHand("left");
    let rightHand = handInputData.getHand("right");

    // Make object appear when left hand pinches
    leftHand.onPinchDown.add(() => {
      if (this.targetObject) {
        this.positionAndRotateLaser('left', leftHand);
      }
    });

    // Make object appear when right hand pinches
    rightHand.onPinchDown.add(() => {
      if (this.targetObject) {
        this.positionAndRotateLaser('right', rightHand);
      }
    });
  }

  positionAndRotateLaser(handName: string, handData) {
    // Get the interactor for the specified hand
    let interactionManager = SIK.InteractionManager;
    let handInteractor = interactionManager.getInteractorsByType(
      handName === 'left' ? InteractorInputType.LeftHand : InteractorInputType.RightHand
    )[0];
    
    if (!handInteractor) return;
    
    // Get the hand position (start of the laser)
    const handPosition = handInteractor.startPoint;
    
    // Get the cursor position (end of the laser)
    // The cursor position is where the hand is pointing
    const cursorPosition = handInteractor.endPoint;
    
    // Calculate direction from hand to cursor
    const direction = cursorPosition.sub(handPosition).normalize();
    
    // Get the transform of the target object (laser)
    const transform = this.targetObject.getTransform();
    
    // Set the position to the hand position (start of laser)
    transform.setWorldPosition(handPosition);
    
    // Calculate the rotation to point from hand to cursor
    // We need to align the laser's forward direction with our calculated direction
    const forward = vec3.forward();
    const rotationAxis = forward.cross(direction).normalize();
    const angle = forward.angleTo(direction);
    
    // Create rotation from axis and angle
    const rotation = quat.angleAxis(angle, rotationAxis);
    transform.setWorldRotation(rotation);
    
    // Calculate the distance between hand and cursor
    const distance = handPosition.distance(cursorPosition);
    
    // Scale the laser to reach the cursor position
    // Assuming the laser's local forward axis is along Z
    transform.setWorldScale(new vec3(1, 1, distance));
    
    // Make the object visible
    this.targetObject.enabled = true;
    this.sceneObject.getComponent("AudioComponent").play(1);
    
    // print(`Laser appeared from ${handName} hand to cursor position!`);
  }

  onUpdate() {
    // Retrieve InteractionManager from SIK's definitions.
    let interactionManager = SIK.InteractionManager;

    // Fetch the HandInteractor for left and right hands.
    let leftHandInteractor = interactionManager.getInteractorsByType(
      InteractorInputType.LeftHand
    )[0];
    let rightHandInteractor = interactionManager.getInteractorsByType(
      InteractorInputType.RightHand
    )[0];

    // Print the position and direction of the HandInteractors each frame.
    // print(
    //   `The left hand interactor is at position: ${leftHandInteractor.startPoint} and is pointing in direction: ${leftHandInteractor.direction}.`
    // );
    // print(
    //   `The right hand interactor is at position: ${rightHandInteractor.startPoint} and is pointing in direction: ${rightHandInteractor.direction}.`
    // );
  }
}
