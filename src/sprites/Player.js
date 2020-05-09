const SPEEDS = {
  red: 300,
  green: 600,
  blue: 500,
}
const JUMPS = {
  red: 500,
  green: 600,
  blue: 900,
}
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, 'player')
    this.scene = scene
    this.walk = this.walk.bind(this)
    this.stop = this.stop.bind(this)
    this.action = this.action.bind(this)
    this.scene.physics.world.enable(this)
    this.setAlpha(0.5)
    this.setCollideWorldBounds(true)
    this.body.useDamping = true
    this.setDrag(0.86, 1)
    this.body.setSize(this.width, this.height - 8)
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNames('player', {
        prefix: 'p1_walk',
        start: 1,
        end: 11,
        zeroPad: 2,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.scene.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'p1_stand' }],
      frameRate: 10,
    })
    this.type = type
    if (type === 'red') {
      this.setTint(0xff0000)
    } else if (type === 'green') {
      this.setTint(0x00ff00)
    } else if (type === 'blue') {
      this.setTint(0x0000ff)
    }
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
    this.anims.play('walk', true)
    this.flipX = x < 0
  }
  stop() {
    this.anims.play('idle', true)
  }
  deactivate() {
    this.alpha = 0.5
  }
  activate() {
    this.alpha = 1
  }
  update() {
    if (this.body.onFloor()) {
      this.body.useDamping = true
    }
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
