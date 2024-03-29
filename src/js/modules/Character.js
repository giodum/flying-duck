import * as THREE from 'three'

import gsap from 'gsap'

import Duck from './Duck'
import Parameters from './Parameters'
import Utils3D from './Utils3D'

export default class Character {
  static materials = {}

  // private variables
  #duck
  #egg

  constructor() {
    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init materials
    this.#initGeometriesAndMaterials()

    // initialize duck
    this.#duck = new Duck()
    this.#duck.group.rotation.x = -Math.PI / 20
    this.#duck.group.position.y = 1.8

    // initialize egg
    this.#initEgg()

    // create unique group for character
    this.character = new THREE.Group()
    this.character.add(this.#duck.group)
    this.character.add(this.#egg.group)

    // enable shadows (traversing all elements)
    Utils3D.shadowSupport(this.character)

    // init egg gsap animations
    this.#initCharacterAnimation()
  }

  #initGeometriesAndMaterials() {
    // initialize materials
    if (Object.keys(Character.materials).length == 0) {
      // loop on the associative array
      for (let color in this.parameters.eggColors) {
        const material = new THREE.MeshPhongMaterial({
          color: this.parameters.eggColors[color],
          // flatShading: true,
        })
        Character.materials[color] = material
      }
    }
  }

  #initEgg() {
    this.#egg = {}
    this.#egg.group = new THREE.Object3D()
    this.#egg.group.name = 'egg'

    /* ************** */
    /* MAIN EGG SHAPE */
    /* ************** */

    const eggGeometry = new THREE.CapsuleGeometry(1.4, 1.1, 10, 45)
    const eggMesh = new THREE.Mesh(eggGeometry, Character.materials.white)
    eggMesh.rotation.x = Math.PI / 2

    this.#egg.group.add(eggMesh)

    const eggBorderGeometry = new THREE.BoxGeometry(1.35, 0.2, 1.35, 2, 2)
    const eggBorderMesh = new THREE.Mesh(
      eggBorderGeometry,
      Character.materials.white
    )
    eggBorderMesh.position.y = 1.4

    this.#egg.group.add(eggBorderMesh)

    /* ************* */
    /* EGG PROPELLER */
    /* ************* */

    const eggPropellerGroup1 = new THREE.Group()
    const eggPropeller1Geometry = new THREE.BoxGeometry(0.2, 1.4, 0.2, 2, 2)
    const eggPropeller1Mesh = new THREE.Mesh(
      eggPropeller1Geometry,
      Character.materials.white
    )
    eggPropeller1Mesh.position.y = 0.7
    eggPropellerGroup1.position.z = -2.05

    eggPropellerGroup1.add(eggPropeller1Mesh)

    const eggPropellerGroup2 = eggPropellerGroup1.clone()
    eggPropellerGroup2.rotation.z = (Math.PI * 2) / 3

    const eggPropellerGroup3 = eggPropellerGroup1.clone()
    eggPropellerGroup3.rotation.z = -(Math.PI * 2) / 3

    this.eggPropellerGroup = new THREE.Group()
    this.eggPropellerGroup.add(eggPropellerGroup1)
    this.eggPropellerGroup.add(eggPropellerGroup2)
    this.eggPropellerGroup.add(eggPropellerGroup3)

    this.#egg.group.add(this.eggPropellerGroup)

    /* ***** */
    /* WINGS */
    /* ***** */
    const wingsGeometry = new THREE.BoxGeometry(6, 0.07, 0.9)
    const wingsMesh = new THREE.Mesh(wingsGeometry, Character.materials.white)

    this.#egg.group.add(wingsMesh)
  }

  #initCharacterAnimation() {
    gsap.to(this.character.position, {
      duration: 2,
      x: -2,
      y: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    this.character.rotation.x = -Math.PI / 9
    gsap.to(this.character.rotation, {
      duration: 6,
      x: Math.PI / 9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }

  #animateEgg(time) {
    this.eggPropellerGroup.rotation.z = time * 0.01
  }

  animate(time) {
    // animate duck
    this.#duck.animate(time)

    // animate egg
    this.#animateEgg(time)
  }
}
