import { Player } from '../sprites/Player'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.collectCoin = this.collectCoin.bind(this)
  }

  init() {}

  create() {
    this.map = this.make.tilemap({ key: 'map' })

    const groundTiles = this.map.addTilesetImage('tiles')
    this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])

    const coinTiles = this.map.addTilesetImage('coin')
    this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0)

    this.physics.world.bounds.width = this.groundLayer.width
    this.physics.world.bounds.height = this.groundLayer.height

    this.player = this.add.existing(new Player(this, 200, 200))

    this.physics.add.collider(this.groundLayer, this.player)

    this.coinLayer.setTileIndexCallback(17, this.collectCoin, this)
    this.physics.add.overlap(this.player, this.coinLayer)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    )
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBackgroundColor('#ccccff')

    this.text = this.add.text(20, 570, '0', {
      fontSize: '20px',
      fill: '#ffffff',
    })
    this.text.setScrollFactor(0)
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.player.walk(-300)
    } else if (this.cursors.right.isDown) {
      this.player.walk(300)
    } else {
      this.player.stop()
    }
    if (this.cursors.up.isDown) {
      this.player.jump()
    }
  }

  collectCoin(sprite, tile) {
    this.coinLayer.removeTileAt(tile.x, tile.y)
    this.score++
    this.text.setText(this.score)
    return false
  }
}
