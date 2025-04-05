@component
export class ChangeSize extends BaseScriptComponent {
    onAwake() {

    }

    onStart() {
        this.inputs.interactable.onInteraction.add(() => {
            print("clicked");
        });
    }
}
