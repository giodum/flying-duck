import {GUI} from 'dat.gui'

// singleton pattern
export default class Parameters {
  static #params = {
    param1: 5,
  }

  static #colors = {
    floor: '#87CEEB',
    fog: '#D5F8F8',
    sky: '#87CEEB',
  }

  static #duckColors = {
    black: '#131313',
    brown: '#762825',
    green: '#008e2c',
    orangeLight: '#ff712c',
    orange: '#f96a2b',
    yellow: '#ffe300',
    white: '#f4eddd',
  }

  static #eggColors = {
    white: '#fffcec',
  }

  constructor() {}

  static getInstance() {
    // if never initialized
    // initialize a new instance
    if (!Parameters.instance) {
      Parameters.instance = new Parameters()
    }

    // return the instance
    return Parameters.instance
  }

  // public getter for params
  get params() {
    return Parameters.#params
  }

  // public getter for colors
  get colors() {
    return Parameters.#colors
  }

  // public getter for colors
  get duckColors() {
    return Parameters.#duckColors
  }

  // public getter for colors
  get eggColors() {
    return Parameters.#duckColors
  }

  // setter object for callback functions
  setObject(object) {
    this.object = object
  }

  // initialize GUI
  // to be run after setting object
  initGui() {
    if (!this.object) {
      throw new Error('Object for callbacks has not been passed')
    }

    // init new dat.GUI
    this.gui = new GUI()

    // set GUI width
    this.gui.width = 350
    this.gui.closed = true

    // add parameters to guid
    this.gui
      .add(Parameters.#params, 'param1')
      .min(1)
      .max(30)
      .step(1)
      .name('Param 1')
      .onChange(() => {
        // use callback function from object
        // this.object.callback()
      })
  }
}
