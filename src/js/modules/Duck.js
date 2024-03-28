import * as THREE from 'three'

import Parameters from './Parameters'

const DEV_HELPERS = false
const DEV_WIREFRAMES = true

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
    this.group = new THREE.Object3D()
    this.group.name = 'duck'

    /* ********* */
    /* DUCK BODY */
    /* ********* */

    this.groupBody = new THREE.Object3D()
    this.groupBody.name = 'duck-body'

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

    const wingRight = wingLeft.clone()
    wingRight.position.x = -wingRight.position.x

    this.groupBody.add(wingRight)

    const tailCenter = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    tailCenter.scale.x = bodyMid.scale.x / 9
    tailCenter.scale.y = bodyMid.scale.y / 0.8
    tailCenter.scale.z = bodyMid.scale.x / 5
    tailCenter.position.y = -(bodyMid.scale.y - tailCenter.scale.y) / 1.5
    tailCenter.position.z = -(bodyMid.scale.z / 2 + tailCenter.scale.z / 2)

    this.groupBody.add(tailCenter)

    const tailLeft = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.brown
    )
    tailLeft.scale.x = bodyMid.scale.x / 9
    tailLeft.scale.y = bodyMid.scale.y / 1.1
    tailLeft.scale.z = bodyMid.scale.x / 5
    tailLeft.position.x = -(tailCenter.scale.x / 2 + tailLeft.scale.x / 2)
    tailLeft.position.y = -(bodyMid.scale.y - tailLeft.scale.y) / 1.5
    tailLeft.position.z = -(bodyMid.scale.z / 2 + tailLeft.scale.z / 2)

    this.groupBody.add(tailLeft)

    const tailRight = tailLeft.clone()
    tailRight.position.x = -tailRight.position.x

    this.groupBody.add(tailRight)

    if (DEV_HELPERS) {
      const groupBodyHelper = new THREE.BoxHelper(this.groupBody, 'brown')
      this.group.add(groupBodyHelper)
    }

    this.group.add(this.groupBody)

    /* ********* */
    /* DUCK HEAD */
    /* ********* */

    this.groupHead = new THREE.Object3D()
    this.groupHead.name = 'duck-head'

    const head = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.green
    )
    head.position.y = head.scale.y / 2 + bodyMid.scale.y / 2 + bodyTop.scale.y

    this.groupHead.add(head)

    const beak = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.yellow
    )
    beak.scale.x = 0.7
    beak.scale.y = 0.35
    beak.scale.z = 0.5
    beak.position.y = beak.scale.y / 2 + 0.75
    beak.position.z = bodyMid.scale.z / 2 + beak.scale.z / 2

    this.groupHead.add(beak)

    const leftEyeGroup = new THREE.Group()

    const leftEye = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.white
    )
    leftEye.scale.x = 0.45
    leftEye.scale.y = 0.45
    leftEye.scale.z = 0.15
    leftEye.position.y = 1

    leftEyeGroup.add(leftEye)

    const leftPupil = new THREE.Mesh(
      Duck.geometries.boxGeometry,
      Duck.materials.black
    )
    leftPupil.scale.x = 0.15
    leftPupil.scale.y = 0.15
    leftPupil.scale.z = 0.05
    leftPupil.position.y = leftEye.position.y
    leftPupil.position.z = leftPupil.scale.z / 2 + leftPupil.scale.z

    leftEyeGroup.position.x = bodyMid.scale.x / 2 + leftEye.scale.z / 2
    leftEyeGroup.rotation.y = Math.PI / 2
    leftEyeGroup.add(leftPupil)

    this.groupHead.add(leftEyeGroup)

    const rightEyeGroup = leftEyeGroup.clone()
    rightEyeGroup.position.x = -rightEyeGroup.position.x
    rightEyeGroup.rotation.y = -rightEyeGroup.rotation.y
    this.groupHead.add(rightEyeGroup)

    if (DEV_HELPERS) {
      const groupHead = new THREE.BoxHelper(this.groupHead, 'green')
      this.group.add(groupHead)
    }

    this.group.add(this.groupHead)
  }
}
