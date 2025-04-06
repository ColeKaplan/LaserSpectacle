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
        this.collider = obj;
    }

    onUpdate() {
        if (this.collider) {
            // print("collider exists and position is: " + this.collider.getTransform().getLocalPosition())
            this.collider.getTransform().setWorldPosition(this.sceneObject.getTransform().getWorldPosition());
        }
    }
}
