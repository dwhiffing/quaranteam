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

    const doorTiles = this.map.addTilesetImage('door')
    this.doorLayer = this.map.createDynamicLayer('Doors', doorTiles, 0, 0)

    this.physics.world.bounds.width = this.groundLayer.width
    this.physics.world.bounds.height = this.groundLayer.height

    const c1 = this.map.findObject('Player', (obj) => obj.name === '1')
    const c2 = this.map.findObject('Player', (obj) => obj.name === '2')
    const c3 = this.map.findObject('Player', (obj) => obj.name === '3')

    this.player = this.add.existing(new Player(this, c1.x, c1.y))
    this.player.setTint(0x0000ff)
    this.activePlayer = this.player
    this.player2 = this.add.existing(new Player(this, c2.x, c2.y))
    this.player2.setTint(0xff0000)
    this.player3 = this.add.existing(new Player(this, c3.x, c3.y))
    this.player3.setTint(0x00ff00)

    this.physics.add.collider(this.groundLayer, this.player)
    this.physics.add.collider(this.groundLayer, this.player2)
    this.physics.add.collider(this.groundLayer, this.player3)

    this.coinLayer.setTileIndexCallback(17, this.collectCoin, this)
    this.coinLayer.setTileIndexCallback(19, this.collectCoin, this)
    this.coinLayer.setTileIndexCallback(18, this.collectCoin, this)
    this.physics.add.overlap(this.player, this.coinLayer)
    this.physics.add.overlap(this.player2, this.coinLayer)
    this.physics.add.overlap(this.player3, this.coinLayer)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceKey = this.input.keyboard.addKey('SPACE')
    this.spaceKey.addListener('down', () => this.swap())
    this.cameras.main.zoom = 0.5
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    )
    this.cameras.main.startFollow(this.activePlayer)
    this.cameras.main.setBackgroundColor('#ccccff')
  }

  swap() {
    this.activePlayer.stop()

    if (this.activePlayer === this.player) {
      this.activePlayer = this.player2
    } else if (this.activePlayer === this.player2) {
      this.activePlayer = this.player3
    } else if (this.activePlayer === this.player3) {
      this.activePlayer = this.player
    }
    this.cameras.main.startFollow(this.activePlayer)
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.activePlayer.walk(-300)
    } else if (this.cursors.right.isDown) {
      this.activePlayer.walk(300)
    } else {
      this.activePlayer.stop()
    }
    if (this.cursors.up.isDown) {
      this.activePlayer.jump()
    }
  }

  collectCoin(sprite, tile) {
    this.coinLayer.removeTileAt(tile.x, tile.y)
    this.score++
    return false
  }
}
