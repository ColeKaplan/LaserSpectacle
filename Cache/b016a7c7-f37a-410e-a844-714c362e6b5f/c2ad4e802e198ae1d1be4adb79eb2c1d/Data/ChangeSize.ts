import { Interactable } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Core/Interactor/InteractorEvent";
import { SIK } from "../SpectaclesSyncKit/SpectaclesInteractionKit/SIK";

@component
export class ChangeSize extends BaseScriptComponent {

    onAwake() {
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }

    onStart() {
        let interactionManager = SIK.InteractionManager;

        let interactable = this.sceneObject.getComponent(
            Interactable.getTypeName()
        );

        interactable = interactionManager.getInteractableBySceneObject(
            this.sceneObject
        );

        let onTriggerStartCallback = (event: InteractorEvent) => {
            print(
                `Cole! clicked with input type: ${event.interactor.inputType} at position: ${event.interactor.targetHitInfo.hit.position}`
            );
        };

        interactable.onInteractorTriggerStart(onTriggerStartCallback);

    }
}
