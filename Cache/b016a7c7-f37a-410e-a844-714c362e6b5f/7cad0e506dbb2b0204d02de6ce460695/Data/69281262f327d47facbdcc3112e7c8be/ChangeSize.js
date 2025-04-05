"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeSize = void 0;
var __selfType = requireType("./ChangeSize");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("../SpectaclesSyncKit/SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable");
const SIK_1 = require("../SpectaclesSyncKit/SpectaclesInteractionKit/SIK");
let ChangeSize = class ChangeSize extends BaseScriptComponent {
    onAwake() {
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }
    onStart() {
        let interactionManager = SIK_1.SIK.InteractionManager;
        let interactable = this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName());
        interactable = interactionManager.getInteractableBySceneObject(this.sceneObject);
        let onTriggerStartCallback = (event) => {
            print(`Cole! clicked with input type: ${event.interactor.inputType} at position: ${event.interactor.targetHitInfo.hit.position}`);
            this.sceneObject.getTransform().setLocalScale(this.sceneObject.getTransform().getLocalScale().add(new vec3(1, 1, 1)));
        };
        interactable.onInteractorTriggerStart(onTriggerStartCallback);
    }
};
exports.ChangeSize = ChangeSize;
exports.ChangeSize = ChangeSize = __decorate([
    component
], ChangeSize);
//# sourceMappingURL=ChangeSize.js.map