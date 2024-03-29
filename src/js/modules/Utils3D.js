import * as THREE from 'three'

const Utils3D = {
  shadowSupport(group, enableCast = true, enableReceive = true) {
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = enableCast
        object.receiveShadow = enableReceive
      }
    })
  },
}

export default Utils3D
