import { Interactable } from "../SpectaclesSyncKit/SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";
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
    }
}
