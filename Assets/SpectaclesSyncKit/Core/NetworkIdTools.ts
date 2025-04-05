import {NetworkedScriptComponent} from "./NetworkedScriptComponent"
import {NetworkIdType} from "./NetworkIdType"
import {NetworkRootInfo} from "./NetworkRootInfo"
import {
  findNetworkRoot,
  getSceneObjectHelper,
  isRootObject,
} from "./NetworkUtils"

/**
 * Provides a set of options to use with network id generation
 * @class
 */
export class NetworkIdOptions {
  constructor(
    /**
     * Which method to use for network id generation
     * @type {NetworkIdType?}
     */
    public networkIdType?: NetworkIdType,

    /**
     * Custom network id  to use
     * @type {string?}
     */
    public customNetworkId?: string,

    /**
     * Custom prefix to prepend to the network id
     * @type {string?}
     */
    public customPrefix?: string
  ) {}

  static parseFromScript(scriptComponent: NetworkedScriptComponent) {
    const options = new NetworkIdOptions()
    options.networkIdType = scriptComponent.networkIdType
    options.customNetworkId = scriptComponent.customNetworkId
    return options
  }
}

/**
 * Generates a new network id
 * @param {ScriptComponent} scriptComponent ScriptComponent to generate the id for
 * @param {NetworkIdOptions} networkIdOptions Options to use with id generation
 * @param {NetworkRootInfo=} networkRoot Optional NetworkRootInfo for use with prefab instantiation
 * @returns {string} Generated network id
 */
export function generateNetworkId(
  scriptComponent: ScriptComponent | null,
  networkIdOptions: NetworkIdOptions,
  networkRoot?: NetworkRootInfo
): string {
  if (
    (scriptComponent === null || scriptComponent === undefined) &&
    networkIdOptions.networkIdType != NetworkIdType.Custom
  ) {
    throw new Error(
      "ScriptComponent must be provided when using a non-custom network id type."
    )
  }

  let ret = ""
  switch (networkIdOptions.networkIdType) {
    case NetworkIdType.ObjectId:
    default:
      if (networkRoot) {
        ret = generateNetworkIdFromHierarchy(scriptComponent)
      } else {
        ret = scriptComponent.uniqueIdentifier
      }
      break
    case NetworkIdType.Hierarchy:
      ret = generateNetworkIdFromHierarchy(scriptComponent)
      break
    case NetworkIdType.Custom:
      let networkId = networkIdOptions.customNetworkId
      if (networkRoot) {
        networkId = networkRoot.networkId + "/" + networkId
      }
      ret = networkId
      break
  }
  if (networkIdOptions.customPrefix) {
    ret = networkIdOptions.customPrefix + ret
  }
  return ret
}

/**
 * Returns the index of the component on its SceneObject
 * @param {Component} component
 * @returns {number}
 */
function getComponentIndex(component: Component): number {
  const sceneObject = component.getSceneObject()
  const components: Component[] = (sceneObject as any).getComponents(
    "Component"
  )
  for (let i = 0; i < components.length; i++) {
    if (components[i].isSame(component)) {
      return i
    }
  }
  return -1
}

/**
 * Returns the index of the SceneObject on its parent, or scene root
 * @param {SceneObject} sceneObject
 * @returns {number}
 */
function getSceneObjectIndex(sceneObject: SceneObject): number {
  if (sceneObject.hasParent()) {
    const parent = sceneObject.getParent()
    const count = parent.getChildrenCount()
    for (let i = 0; i < count; i++) {
      if (parent.getChild(i).isSame(sceneObject)) {
        return i
      }
    }
  } else {
    const rootCount = global.scene.getRootObjectsCount()
    for (let i = 0; i < rootCount; i++) {
      if (global.scene.getRootObject(i).isSame(sceneObject)) {
        return i
      }
    }
  }
  return -1
}

/**
 * Generate a network id based on object hierarchy
 * @param {SceneObject|Component} target
 * @returns {string}
 */
function generateNetworkIdFromHierarchy(
  target: SceneObject | Component
): string {
  let path = ""

  const sceneObject = getSceneObjectHelper(target)

  if (target.isOfType("Component")) {
    const component = target as Component
    path = generateNetworkIdFromHierarchy(sceneObject)
    const compIndex = getComponentIndex(component)
    path += "/" + component.getTypeName() + "_" + compIndex
    return path
  }

  if (isRootObject(sceneObject)) {
    const networkRoot = findNetworkRoot(sceneObject)
    return networkRoot.networkId
  }

  if (sceneObject.hasParent()) {
    path = generateNetworkIdFromHierarchy(sceneObject.getParent())
    path += "/"
  }

  const objIndex = getSceneObjectIndex(sceneObject)

  path += sceneObject.name + "_" + objIndex

  return path
}

export const NetworkIdTools = {
  generateNetworkId: generateNetworkId,
  NetworkIdOptions: NetworkIdOptions,
  NetworkIdType: NetworkIdType,
}

// These exports exist for javascript compatibility, and should not be used from typescript code.
;(global as any).networkIdTools = NetworkIdTools
