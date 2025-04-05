@component
export class ChangeSize extends BaseScriptComponent {
    onAwake() {

        inputs!: {
            interactable: Component.Interactable;
        };
    }

    onStart() {
        if (!this.inputs.interactable) {
            print("Interactable not assigned!");
            return;
        }

        this.inputs.interactable.onInteraction.add(() => {
            print("clicked");
        });
    }
}
