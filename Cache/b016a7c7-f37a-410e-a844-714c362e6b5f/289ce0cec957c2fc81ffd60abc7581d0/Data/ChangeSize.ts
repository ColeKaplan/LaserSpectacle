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
    }
}
