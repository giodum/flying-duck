import * as THREE from 'three'

import Duck from './Duck'
import Parameters from './Parameters'

export default class Character {
  static materials = {}

  constructor() {
    // initialize duck
    this.duck = new Duck()
  }
}
