@component
export class PlayerPositionUpdater extends BaseScriptComponent {

    private collider : SceneObject

    onAwake() {
        this.collider = null;
        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate()
        });
    }

    public registerCollider(obj : SceneObject) {
        print("registerCollider wsas called")
        print(obj)
        this.collider = obj;
        print(this.collider)
    }

    onUpdate() {
        if (this.collider) {
            print("collider exists and position is: " + this.collider.getTransform().getLocalPosition())
            this.collider.getTransform().setLocalPosition(this.sceneObject.getTransform().getLocalPosition());
        }
    }
}
