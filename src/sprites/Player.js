const SPEEDS = {
  red: 200,
  green: 300,
  blue: 300,
}
const JUMPS = {
  red: 400,
  green: 400,
  blue: 600,
}

const TINTS = {
  red: 0xe86a17,
  blue: 0x1ea7e1,
  green: 0x73cd4b,
}
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.scene = scene
    this.walk = this.walk.bind(this)
    this.climb = this.climb.bind(this)
    this.jumpSound = this.scene.sound.add('jump', { volume: 2 })
    this.stop = this.stop.bind(this)
    this.action = this.action.bind(this)
    this.activate = this.activate.bind(this)
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.body.setMaxVelocity(300, 600)

    this.setCollideWorldBounds(true)
    this.body.useDamping = true
    this.setDrag(0.86, 0.9)
    this.body.setSize(this.width, this.height - 8)

    this.type = object.name
    this.name = object.name
    let frames
    if (this.type === 'red') {
      this.setSize(58, 40)
      this.setOffset(3, 21)
      frames = {
        walk: { start: 81, end: 82, frameRate: 4 },
        jump: { start: 83, end: 84, frameRate: 5 },
        idle: { start: 79, end: 80, frameRate: 2 },
      }
    } else if (this.type === 'green') {
      this.setSize(58, 40)
      this.setOffset(3, 21)
      frames = {
        walk: { start: 19, end: 22, frameRate: 10 },
        jump: { start: 23, end: 23, frameRate: 10 },
        idle: { start: 19, end: 20, frameRate: 2 },
      }
    } else if (this.type === 'blue') {
      this.setScale(1.3)
      this.setSize(40, 40)
      this.setOffset(10, 21)
      frames = {
        walk: { start: 51, end: 53, frameRate: 9 },
        jump: { start: 54, end: 57, frameRate: 9 },
        idle: { start: 49, end: 50, frameRate: 2 },
      }
    }
    this.scene.anims.create({
      key: `walk${this.type}`,
      frames: this.scene.anims.generateFrameNames('tilemap', {
        start: frames.walk.start,
        end: frames.walk.end,
      }),
      frameRate: frames.walk.frameRate,
      repeat: -1,
    })
    this.scene.anims.create({
      key: `idle${this.type}`,
      frames: this.scene.anims.generateFrameNames('tilemap', {
        start: frames.idle.start,
        end: frames.idle.end,
      }),
      frameRate: frames.idle.frameRate,
    })
    this.scene.anims.create({
      key: `jump${this.type}`,
      frames: this.scene.anims.generateFrameNames('tilemap', {
        start: frames.jump.start,
        end: frames.jump.end,
      }),
      frameRate: frames.jump.frameRate,
    })

    this.activate()
    this.deactivate()
    this.anims.play(`idle${this.type}`, true)
  }
  walk(x) {
    const baseSpeed = SPEEDS[this.type]
    const speed =
      this.body.onFloor() || this.body.touching.down
        ? baseSpeed
        : baseSpeed * 0.3

    if (this.body.onFloor() || this.body.touching.down) {
      this.anims.play(`walk${this.type}`, true)
    }
    if (
      this.body.onFloor() ||
      this.body.touching.down ||
      (this.body.velocity.x < speed && this.body.velocity.x > -speed)
    ) {
      this.body.setVelocityX(x * speed)
    }
    this.flipX = x < 0
  }
  stop() {
    if (this.body.onFloor() || this.body.touching.down) {
      this.anims.play(`idle${this.type}`, true)
    }
  }
  deactivate() {
    this.alpha = 0.5
    this.stop()
  }
  activate() {
    this.alpha = 1
    this.setDepth(2)
    this.scene.background.setTint(TINTS[this.type])
    const lastX = this.scene.cameras.main.scrollX
    const lastY = this.scene.cameras.main.scrollY
    this.scene.cameras.main.startFollow(this, true, 0.2, 0.2)
    this.scene.cameras.main.scrollX = lastX
    this.scene.cameras.main.scrollY = lastY
  }
  update() {
    this.body.useDamping =
      this.body.onFloor() || this.canClimb || this.body.touching.down
    if (!this.body.onFloor()) {
      this.body.setAllowGravity(!this.canClimb)
    }
    this.canClimb = false
  }
  climb(direction) {
    if (!this.canClimb) {
      return
    }
    this.body.setAllowGravity(false)
    this.body.setVelocityY(direction === 2 ? -250 : 250)
  }
  action() {
    if (this.body.onFloor() || this.body.touching.down) {
      this.anims.play(`jump${this.type}`, true)
      this.body.setVelocityY(-JUMPS[this.type])
      this.jumpSound.play()
      if (this.type === 'blue') {
        this.body.setVelocityX(0)
      } else if (this.type === 'green') {
        this.body.setVelocityX(this.flipX ? -400 : 400)
        this.body.useDamping = false
      }
    }
  }
}
