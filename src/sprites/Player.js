export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    this.scene = scene
    this.walk = this.walk.bind(this)
    this.stop = this.stop.bind(this)
    this.jump = this.jump.bind(this)
    this.scene.physics.world.enable(this)
    this.setCollideWorldBounds(true)
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
  }
  walk(x) {
    this.body.setVelocityX(x)
    this.anims.play('walk', true)
    this.flipX = x < 0
  }
  stop() {
    this.body.setVelocityX(0)
    this.anims.play('idle', true)
  }
  jump() {
    if (this.body.onFloor()) {
      this.body.setVelocityY(-700)
    }
  }
}
