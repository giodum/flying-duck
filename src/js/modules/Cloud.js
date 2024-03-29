import * as THREE from 'three'

import gsap from 'gsap'

import Parameters from './Parameters'

import random from 'canvas-sketch-util/random'

export default class Cloud {
  static #cloudGeometry
  static #cloudMaterial

  constructor(config) {
    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init main group
    this.mesh = new THREE.Group()

    // init materials and geometries
    this.#initGeometriesAndMaterial()

    // init cloud mesh
    this.#initCloud()

    this.mesh.position.x = 200
    this.mesh.position.y = config.y || random.range(0, 1)
    this.mesh.position.z = config.z || 0

    this.mesh.add(this.cloudGroup)

    // init gsap cloud animation
    this.#initCloudAnimation(config)
  }

  #initGeometriesAndMaterial() {
    // initialize geometry
    if (!Cloud.#cloudGeometry) {
      Cloud.#cloudGeometry = new THREE.SphereGeometry(5, 4, 6)
    }

    // initialize material
    if (!Cloud.#cloudMaterial) {
      Cloud.#cloudMaterial = new THREE.MeshPhongMaterial({
        color: this.parameters.colors.clouds,
        flatShading: true,
      })
    }
  }

  #initCloud(config) {
    this.cloudGroup = new THREE.Group()

    const cloud = new THREE.Mesh(Cloud.#cloudGeometry, Cloud.#cloudMaterial)
    cloud.scale.set(1, 0.8, 1)

    const cloud2 = cloud.clone()
    cloud2.scale.set(0.55, 0.35, 1)
    cloud2.position.set(5, -1.5, 2)

    const cloud3 = cloud.clone()
    cloud3.scale.set(0.75, 0.5, 1)
    cloud3.position.set(-5.5, -2, -1)

    this.cloudGroup.add(cloud)
    this.cloudGroup.add(cloud2)
    this.cloudGroup.add(cloud3)
  }

  #initCloudAnimation(config) {
    gsap.to(this.mesh.position, {
      duration: 3.5,
      x: -200,
      repeat: -1,
      delay: config.delay || 0,
      onRepeat: () => {
        this.mesh.position.y = random.rangeFloor(-10, 20)
      },
    })
  }
}
