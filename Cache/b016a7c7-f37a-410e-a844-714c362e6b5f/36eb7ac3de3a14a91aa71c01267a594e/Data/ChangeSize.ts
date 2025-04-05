@component
export class ChangeSize extends BaseScriptComponent {
    
    onAwake() {
        this.createEvent('OnStartEvent').bind(() => {
          this.onStart();
        });
      }

    onStart() {
        this.inputs.interactable.onInteraction.add(() => {
            print("clicked");
        });
    }
}
