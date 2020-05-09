export class ObjectSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'objects')
    this.scene = scene
    this.type = object.type
    this.gid = object.gid
    this.name = NAMES[this.type][this.gid]
    this.scene.physics.world.enable(this)
    this.setCollideWorldBounds(true)
    this.isPressed = false
    this.setOrigin(0, 1)
    this.scene.add.existing(this)
    const frameSet = FRAMES[this.type]
    const frame = frameSet[this.gid] || frameSet[-1]
    this.setFrame(frame)

    setTimeout(() => {
      if (this.body && this.type === 'crate') {
        this.body.useDamping = true
        this.body.setDrag(0.8, 0.8)
      }
    }, 0)
    this.overlap = this.overlap.bind(this)
  }

  overlap(player, callback) {
    if (this.type === 'coin') {
      this.destroy()
    }

    if (this.type === 'exit') {
      player.setVisible(false)
    }

    if (this.type === 'ladder') {
      player.canClimb = true
    }

    if (this.type === 'button' && player.name === this.name) {
      if (this.isPressed) {
        return
      }
      this.isPressed = true
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.isPressed = false
        },
      })
      callback(this)
    }
  }
}

export const FRAMES = {
  coin: {
    [-1]: 0,
    17: 0,
    18: 1,
    19: 2,
  },
  button: {
    [-1]: 8,
    25: 8,
    26: 9,
    27: 10,
  },
  crate: {
    [-1]: 3,
    23: 6,
    21: 4,
    22: 5,
  },
  exit: {
    [-1]: 14,
  },
  ladder: {
    [-1]: 7,
  },
}
const NAMES = {
  coin: {
    [-1]: 'green',
    17: 'green',
    18: 'blue',
    19: 'red',
  },
  button: {
    [-1]: 'green',
    25: 'green',
    26: 'blue',
    27: 'red',
  },
  crate: {
    [-1]: 'crate',
    23: 'red',
    21: 'green',
    22: 'blue',
  },
  exit: {
    [-1]: 'exit',
  },
  ladder: {
    [-1]: 'ladder',
  },
}
