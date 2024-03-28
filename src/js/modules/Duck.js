import * as THREE from 'three'

import Parameters from './Parameters'

export default class Duck {
  static geometries = {}
  static materials = {}

  constructor() {
    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init geometries and materials
    this.#initGeometriesAndMaterials()

    // initialize duck
    this.#initDuck()
  }

  #initGeometriesAndMaterials() {
    // initialize geometries
    if (Object.keys(Duck.geometries).length == 0) {
      Duck.geometries.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    }

    // initialize materials
    if (Object.keys(Duck.materials).length == 0) {
      // loop on the associative array
      for (let color in this.parameters.duckColors) {
        const material = new THREE.MeshPhongMaterial({
          color: this.parameters.duckColors[color],
          flatShading: true,
        })
        Duck.materials[color] = material
      }
    }
  }

  #initDuck() {
    // init group
    this.group = new THREE.Group()

    // create body

    this.groupBody = new THREE.Group()

    const bodyMid = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    bodyMid.scale.y = 0.6

    this.groupBody.add(bodyMid)

    const bodyTop = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.white
    )
    bodyTop.scale.y = 0.1
    bodyTop.position.y = bodyMid.scale.y / 2 + bodyTop.scale.y / 2

    this.groupBody.add(bodyTop)

    const bodyBottom = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.orangeLight
    )
    bodyBottom.scale.y = 0.25
    bodyBottom.position.y = -bodyMid.scale.y / 2 - bodyBottom.scale.y / 2

    this.groupBody.add(bodyBottom)

    const wingLeft = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    wingLeft.scale.x = 0.25
    wingLeft.scale.y = 0.45
    wingLeft.scale.z = 0.8
    wingLeft.position.x = bodyMid.scale.x / 2 + wingLeft.scale.x / 2
    wingLeft.position.y = -(bodyMid.scale.y - wingLeft.scale.y) / 2
    wingLeft.position.z = -(bodyMid.scale.z - wingLeft.scale.z)

    this.groupBody.add(wingLeft)

    const wingRight = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    wingRight.scale.x = 0.25
    wingRight.scale.y = 0.45
    wingRight.scale.z = 0.8
    wingRight.position.x = -(bodyMid.scale.x / 2 + wingRight.scale.x / 2)
    wingRight.position.y = -(bodyMid.scale.y - wingRight.scale.y) / 2
    wingRight.position.z = -(bodyMid.scale.z - wingRight.scale.z)

    this.groupBody.add(wingRight)

    const tailCenter = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    tailCenter.scale.x = bodyMid.scale.x / 9
    tailCenter.scale.y = bodyMid.scale.y / 1.5
    tailCenter.scale.z = bodyMid.scale.x / 9
    tailCenter.position.y = -(bodyMid.scale.y - tailCenter.scale.y) / 1.5
    tailCenter.position.z = -(bodyMid.scale.z / 2 + tailCenter.scale.z / 2)

    this.groupBody.add(tailCenter)

    const tailLeft = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    tailLeft.scale.x = bodyMid.scale.x / 9
    tailLeft.scale.y = bodyMid.scale.y / 2.2
    tailLeft.scale.z = bodyMid.scale.x / 9
    tailLeft.position.x = -(tailCenter.scale.x / 2 + tailLeft.scale.x / 2)
    tailLeft.position.y = -(bodyMid.scale.y - tailLeft.scale.y) / 1.5
    tailLeft.position.z = -(bodyMid.scale.z / 2 + tailLeft.scale.z / 2)

    this.groupBody.add(tailLeft)

    const tailRight = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    tailRight.scale.x = bodyMid.scale.x / 9
    tailRight.scale.y = bodyMid.scale.y / 2.2
    tailRight.scale.z = bodyMid.scale.x / 9
    tailRight.position.x = tailCenter.scale.x / 2 + tailRight.scale.x / 2
    tailRight.position.y = -(bodyMid.scale.y - tailRight.scale.y) / 1.5
    tailRight.position.z = -(bodyMid.scale.z / 2 + tailRight.scale.z / 2)

    this.groupBody.add(tailRight)

    this.group.add(this.groupBody)
  }
}
