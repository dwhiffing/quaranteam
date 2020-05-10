const SPEEDS = {
  red: 400,
  green: 600,
  blue: 500,
}
const JUMPS = {
  red: 600,
  green: 600,
  blue: 900,
}
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.scene = scene
    this.walk = this.walk.bind(this)
    this.climb = this.climb.bind(this)
    this.stop = this.stop.bind(this)
    this.action = this.action.bind(this)
    this.activate = this.activate.bind(this)
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.body.setMaxVelocity(600, 900)

    this.setAlpha(0.5)
    this.setCollideWorldBounds(true)
    this.body.useDamping = true
    this.setDrag(0.86, 0.9)
    this.body.setSize(this.width, this.height - 8)

    this.type = object.name
    this.name = object.name
    let frames
    if (this.type === 'red') {
      frames = [86, 89, 79]
    } else if (this.type === 'green') {
      frames = [26, 29, 19]
    } else if (this.type === 'blue') {
      frames = [56, 59, 49]
    }
    this.scene.anims.create({
      key: `walk${this.type}`,
      frames: this.scene.anims.generateFrameNames('tilemap', {
        start: frames[0],
        end: frames[1],
      }),
      frameRate: 4,
      repeat: -1,
    })
    this.scene.anims.create({
      key: `idle${this.type}`,
      frames: this.scene.anims.generateFrameNames('tilemap', {
        start: frames[2],
        end: frames[2],
      }),
      frameRate: 4,
    })
    this.setSize(40, 50)
    this.setOffset(12, 11)
  }
  walk(x) {
    const baseSpeed = SPEEDS[this.type]
    const speed = this.body.onFloor() ? baseSpeed : baseSpeed * 0.3

    if (
      this.body.onFloor() ||
      (this.body.velocity.x < speed && this.body.velocity.x > -speed)
    ) {
      this.body.setVelocityX(x * speed)
    }
    this.anims.play(`walk${this.type}`, true)
    this.flipX = x < 0
  }
  stop() {
    this.anims.play(`idle${this.type}`, true)
  }
  deactivate() {
    this.alpha = 0.5
    this.stop()
  }
  activate() {
    this.alpha = 1
    this.setDepth(2)
    this.scene.cameras.main.startFollow(this)
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
    if (this.body.onFloor()) {
      this.anims.play('idle', true)
      this.body.setVelocityY(-JUMPS[this.type])
      if (this.type === 'blue') {
        this.body.setVelocityX(0)
      } else if (this.type === 'green') {
        this.body.setVelocityX(this.flipX ? -700 : 700)
        this.body.useDamping = false
      }
    }
  }
}
