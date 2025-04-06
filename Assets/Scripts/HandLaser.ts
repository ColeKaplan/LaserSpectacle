import { SIK } from "../SpectaclesSyncKit/SpectaclesInteractionKit/SIK";
import { InteractorInputType } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Core/Interactor/Interactor";
import { Instantiator } from "../SpectaclesSyncKit/Components/Instantiator";
import { NetworkRootInfo } from "../SpectaclesSyncKit/Core/NetworkRootInfo";
import { PinchButton } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";

@component
export class HandLaser extends BaseScriptComponent {
  // Define a public variable for your target object
  @input()
  public laserPrefab: ObjectPrefab;

  @input()
  instantiator: Instantiator

  // Add input for laser sound
  @input()
  public laserSound: AudioComponent;

  // @input
  // UI: PinchButton

  private canInstantiate: boolean


  onAwake() {
    // print("awake")
    this.canInstantiate = false;

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate();
    });

    // Set up pinch detection
    this.setupPinchDetection();

    this.instantiator.notifyOnReady(() => {
      this.canInstantiate = true
    })

    // this.UI.onButtonPinched.add(() => {
    //   this.shootLaser();
    // })
  }

  setupPinchDetection() {



    // Retrieve HandInputData from SIK's definitions
    let handInputData = SIK.HandInputData;

    // Fetch the TrackedHand for left and right hands
    let leftHand = handInputData.getHand("left");
    let rightHand = handInputData.getHand("right");

    // Make object appear when left hand pinches
    leftHand.onPinchDown.add(() => {
      this.shootLaser();
    });

    // Make object appear when right hand pinches
    rightHand.onPinchDown.add(() => {
      this.shootLaser();
    });
  }

  shootLaser() {
    // print("shoot laser triggered")
    if (this.canInstantiate && false) {
      this.instantiator.instantiate(
        this.laserPrefab,
        {},
        (networkRootInfo: NetworkRootInfo) => {
          const newObj = networkRootInfo.instantiatedObject;
          this.positionAndRotateLaser(newObj)
          // print('Cole shot a laser: ' + newObj.name);
        }
      );
    }
  }

  public positionAndRotateLaser(targetObject: SceneObject) {

    const probe = Physics.createGlobalProbe();
    probe.filter.includeStatic = true;
    probe.filter.includeDynamic = true;


    // Get the interactor for the specified hand
    let interactionManager = SIK.InteractionManager;
    let handInteractor = interactionManager.getInteractorsByType(
      InteractorInputType.RightHand
    )[0];

    if (!handInteractor) return;

    // Get the hand position (start of the laser)
    const handPosition = handInteractor.startPoint;

    // Get the cursor position (end of the laser)
    // The cursor position is where the hand is pointing
    const cursorPosition = handInteractor.endPoint;

    // Calculate direction from hand to cursor
    const direction = cursorPosition.sub(handPosition).normalize();

    let hitDistance = 20000; // Default max distance
    let endPos = handPosition.add(direction.uniformScale(hitDistance));
    let worldCollision = false;

    // Use physics raycast to detect collision with world mesh
    probe.rayCast(handPosition, endPos, (hit) => {
      if (hit) {
        print("Hit detected! Distance: " + hit.distance + " Collider: " + hit.collider);
        worldCollision = true
        hitDistance = hit.distance;
        endPos = hit.position;
      } else {
        print("No hit detected");
      }
    });

    // Get the transform of the target object (laser)
    const transform = targetObject.getTransform();

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
    
    // if (worldCollision) {
    //   const zDistance = transform.getWorldScale().z
    //   transform.setWorldScale(transform.getWorldScale().mult(new vec3(1, 1, hitDistance / zDistance)))
    //   print("rescaling to distance: " + hitDistance)
    // } else {
      transform.setWorldScale(transform.getWorldScale().mult(new vec3(1, 1, 10)))
    // }


    // Play laser sound if available
    if (this.laserSound) {
      this.laserSound.play(1.0);
    }

    // Make the object visible
    targetObject.enabled = true;

    // print(`Laser propagating from ${handName} hand!`);
  }

  // New method to animate the laser propagation
  animateLaserPropagation(targetObject: SceneObject, startPos: vec3, endPos: vec3, direction: vec3) {
    // Calculate the total distance - now much longer
    const totalDistance = startPos.distance(endPos);

    // Get the transform of the target object (laser)
    const transform = targetObject.getTransform();

    // Reset scale to minimum
    transform.setWorldScale(new vec3(1, 1, 0.1));

    // Create variables for animation
    let headPosition = 0.1;  // Front of the laser
    let tailPosition = 0;    // Back of the laser
    const beamLength = 200;    // Increased length of the visible laser beam
    const propagationSpeed = 5; // Increased speed of the laser propagation

    // Clear any existing animation events
    if (this.laserAnimationEvent) {
      this.laserAnimationEvent.remove();
      this.laserAnimationEvent = null;
    }

    // Create and store the animation event
    this.laserAnimationEvent = this.createEvent("UpdateEvent").bind(() => {
      // Increase the head position
      headPosition = Math.min(headPosition + getDeltaTime() * propagationSpeed, totalDistance);

      // Calculate where the tail should be
      tailPosition = Math.max(0, headPosition - beamLength);

      // Calculate the current beam length
      const currentBeamLength = headPosition - tailPosition;

      // Calculate the center position of the beam
      const beamCenter = tailPosition + (currentBeamLength / 2);

      // Multiply the direction vector by the scalar beamCenter to get the offset vector
      const offset = direction.uniformScale(beamCenter);
      const newPosition = startPos.add(offset);

      // Update the position of the laser (move it forward as it propagates)

      try {
        transform.setWorldPosition(newPosition);
        transform.setWorldScale(new vec3(1, 1, currentBeamLength));
      } catch (error) {
        print(error)
      }

      // If the head has reached the target distance and the tail has caught up to the end
      if (headPosition >= totalDistance && tailPosition >= totalDistance) {
        // Hide the laser when it's done
        targetObject.enabled = false;

        if (this.laserAnimationEvent) {
          this.laserAnimationEvent.remove();
          this.laserAnimationEvent = null;
        }
      }
    });
  }

  // Initialize the property in the class
  private laserAnimationEvent: any = null;

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
