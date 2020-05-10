export class ObjectSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.scene = scene
    this.type = object.type
    this.gid = object.gid
    this.name = NAMES[this.type][this.gid]
    this.scene.physics.world.enable(this)
    this.setCollideWorldBounds(true)
    this.isPressed = false
    this.setOrigin(0, 1)
    this.scene.add.existing(this)
    this.setFrame(this.gid - 1)

    setTimeout(() => {
      if (this.body && this.type === 'crate') {
        this.body.useDamping = true
        this.body.setDrag(0.8, 1)
      }
      if (this.body && this.type === 'button') {
        this.body.useDamping = true
        this.setSize(45, 40)
        this.setOffset(8, 20)
      }
      if (this.body && this.type === 'ladder') {
        this.body.useDamping = true
        this.setSize(22, 62)
        this.setOffset(20, 0)
      }
      if (this.body && this.type === 'exit') {
        this.body.useDamping = true
        this.setSize(30, 30)
        this.setOffset(17, 20)
      }
    }, 0)
    this.overlap = this.overlap.bind(this)
  }

  overlap(player, callback) {
    if (this.type === 'coin') {
      this.destroy()
    }

    if (this.type === 'exit' && player.visible) {
      player.setVisible(false)
      this.scene.swap()
    }

    if (this.type === 'ladder') {
      player.canClimb = true
    }

    if (
      (this.type === 'button' && player.name === this.name) ||
      player.name === 'any' ||
      this.name === 'any'
    ) {
      if (this.isPressed) {
        return
      }
      this.isPressed = true
      this.setFrame(this.frame.name + 60)
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.isPressed = false
          this.setFrame(this.frame.name - 60)
        },
      })
      callback(this)
    }
  }
}

export const NAMES = {
  coin: {
    [-1]: 'green',
    17: 'green',
    18: 'blue',
    19: 'red',
  },
  button: {
    [-1]: 'any',
    75: 'any',
    76: 'green',
    106: 'blue',
    105: 'red',
  },
  locks: {
    [-1]: 'any',
    195: 'any',
    196: 'green',
    226: 'blue',
    225: 'red',
  },
  crate: {
    192: 'any',
    281: 'red',
    283: 'green',
    282: 'blue',
  },
  exit: {
    [-1]: 'exit',
  },
  ladder: {
    [-1]: 'ladder',
  },
}
