import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'stats.js'

import gsap from 'gsap'

import math from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'

import Character from './Character'
import Cloud from './Cloud'
import Parameters from './Parameters'

const DEV_HELPERS = true
const DEV_WIREFRAMES = true

export default class Scene3D {
  // unique instance
  static item = null

  // screen variable
  #mouse = new THREE.Vector2(0, 0)
  #window = {
    aspectRatio: window.innerWidth / window.innerHeight,
    height: window.innerHeight,
    width: window.innerWidth,
  }

  constructor() {
    // check previous existance of the instance
    if (Scene3D.item) {
      throw new Error('Scene3D has already been initialized')
    }

    // init stats
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
    this.stats.dom.classList.add('stats')

    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init renderer and scene
    this.#initRendererAndScene()

    // init basic helpers
    this.#initBasicHelpers()

    // init camera
    this.#initCamera()

    // init orbit control
    this.#initOrbitControl()

    // init lights
    this.#initLights()

    // init floor
    this.#initFloor()

    // init elements
    this.#initElements()

    // add event listeners
    this.eventListeners()

    // animation loop
    this.animate()
  }

  #initRendererAndScene() {
    // init renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: document.querySelector('canvas'),
    })
    this.renderer.setSize(this.#window.width, this.#window.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(this.parameters.colors.sky)
    this.renderer.shadowMap.enabled = true

    // init scene
    this.scene = new THREE.Scene()

    // add fog
    this.scene.fog = new THREE.Fog(this.parameters.colors.fog, 100, 300)
  }

  #initBasicHelpers() {
    if (DEV_HELPERS) {
      // axes helper
      const axesHelper = new THREE.AxesHelper(300)
      axesHelper.setColors()
      this.scene.add(axesHelper)

      // grid helper
      let gridHelper = new THREE.GridHelper(30, 30)
      this.scene.add(gridHelper)
    }
  }

  #initCamera() {
    // init camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.#window.aspectRatio,
      1,
      2000
    )
    // this.camera.position.set(40, 20, 100)
    this.camera.position.set(10, 5, 10)
    this.scene.add(this.camera)

    // if (DEV_HELPERS) {
    //   const cameraHelper = new THREE.CameraHelper(this.camera)
    //   this.scene.add(cameraHelper)
    // }
  }

  #initOrbitControl() {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbit.minDistance = 1
    this.orbit.maxDistance = 250
    this.orbit.update()
  }

  #initLights() {
    this.ambientLight = new THREE.AmbientLight(0xc5f5f5, 3)
    this.scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    this.directionalLight.position.set(30, 20, 0)
    this.directionalLight.castShadow = true
    this.scene.add(this.directionalLight)

    if (DEV_HELPERS) {
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        this.directionalLight,
        5
      )
      this.scene.add(directionalLightHelper)
    }
  }

  #initFloor() {
    // init floor
    this.floor = {}
    this.floor.geometry = new THREE.PlaneGeometry(1000, 1000)
    this.floor.material = new THREE.MeshBasicMaterial({
      color: this.parameters.colors.floor,
    })
    this.floor.mesh = new THREE.Mesh(this.floor.geometry, this.floor.material)

    this.floor.mesh.rotation.x = -Math.PI / 2
    this.floor.mesh.position.y = -100

    this.scene.add(this.floor.mesh)
  }

  #initElements() {
    // init character
    this.character = new Character()
    this.scene.add(this.character.character)

    // init clouds
    const nClouds = random.rangeFloor(2, 7)
    for (let i = 0; i < nClouds; i++) {
      const cloud = new Cloud({
        delay: random.range(0, 3),
        y: random.rangeFloor(-6, -2),
        z: random.range(-20, 20),
      })
      this.scene.add(cloud.mesh)
    }
  }

  eventListeners() {
    // mouse mouve and mobile touch move
    window.addEventListener('mousemove', this.mouseMove.bind(this))
    window.addEventListener('touchmove', this.mouseMove.bind(this))

    // resize
    window.addEventListener('resize', this.resize.bind(this))
  }

  animate(time) {
    requestAnimationFrame((time) => this.animate(time))

    this.stats.begin()

    this.character.animate(time)

    // clear buffer and render the scene
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)

    this.stats.end()
  }

  mouseMove(event) {
    // interpolate mouse movement to make it smootjìh
    gsap.to(this.#mouse, {
      duration: 1,
      x:
        event.clientX ||
        event.pageX ||
        (event.touches ? event.touches[0].pageX : 0),
      y:
        event.clientY ||
        event.pageY ||
        (event.touches ? event.touches[0].pageY : 0),
      ease: 'power2.out',
    })
  }

  resize() {
    // update window info
    this.#window.aspectRatio = window.devicePixelRatio
    this.#window.height = window.height
    this.#window.width = window.width

    // update renderer
    this.renderer.setSize(this.#window.width, this.#window.height)
    this.camera.aspect = this.#window.aspectRatio
    this.camera.updateProjectionMatrix()
  }

  static init() {
    if (!Scene3D.item) {
      Scene3D.item = new Scene3D()
    }
  }
}
