@component
export class NewScript extends BaseScriptComponent {
    onAwake() {

    }

    onStart() {
        this.onButtonPinched.add(() => {
            print("clicked UI toggle")
            this.visible = !this.visible
            this.UI.getSceneObject().getChild(0).enabled = this.visible
        })
    }
}
