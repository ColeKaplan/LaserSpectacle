import { Interactable } from "../SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";

@component
export class ChangeSize extends BaseScriptComponent {
    onAwake() {

    }

    onStart() {
        this.onInteraction.add(() => {
            print("clicked")
        })
    }
}
