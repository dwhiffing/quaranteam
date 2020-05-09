import { Player } from '../sprites/Player'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.collectCoin = this.collectCoin.bind(this)
    this.touchButton = this.touchButton.bind(this)
    this.toggleTile = this.toggleTile.bind(this)
  }

  init() {}

  create() {
    this.map = this.make.tilemap({ key: 'map' })

    const groundTiles = this.map.addTilesetImage('tiles')
    this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])

    const exitTiles = this.map.addTilesetImage('objects')
    this.exitLayer = this.map.createDynamicLayer('Exit', exitTiles, 0, 0)

    this.players = this.add.group()
    this.buttons = this.physics.add.group()

    this.toggleWalls = this.groundLayer
      .getTilesWithinWorldXY(0, 0, 999999, 999999)
      .filter((tile) => tile.index >= 5 && tile.index <= 7)

    this.objLayer = this.map.getObjectLayer('Objects')
    this.objLayer.objects.forEach((object) => {
      if (object.type === 'spawn') {
        this[`${object.name}Player`] = this.add.existing(
          new Player(this, object.x, object.y, object.name),
        )
      }
      if (object.type === 'coin') {
        const coin = this.add
          .image(object.x, object.y, 'objects')
          .setOrigin(0, 1)
        if (object.gid === 17) {
          coin.setFrame(0)
        }
        if (object.gid === 18) {
          coin.setFrame(1)
        }
        if (object.gid === 19) {
          coin.setFrame(2)
        }
      }
      if (object.type === 'switch') {
        const button = this.add
          .sprite(object.x, object.y, 'objects')
          .setOrigin(0, 1)
        this.buttons.add(button)
        button.body.setAllowGravity(false)
        if (object.gid === 25) {
          button.setFrame(8)
          button.type = 'green'
        }
        if (object.gid === 26) {
          button.setFrame(9)
          button.type = 'blue'
        }
        if (object.gid === 27) {
          button.setFrame(10)
          button.type = 'red'
        }
        // button.on('co', () => {
        //   console.log('tstart')
        // })
      }
    })

    this.physics.world.bounds.width = this.groundLayer.width
    this.physics.world.bounds.height = this.groundLayer.height

    this.activePlayer = this.redPlayer
    this.activePlayer.activate()
    this.players.add(this.redPlayer)
    this.players.add(this.greenPlayer)
    this.players.add(this.bluePlayer)

    this.physics.add.collider(this.groundLayer, this.redPlayer)
    this.physics.add.collider(this.groundLayer, this.greenPlayer)
    this.physics.add.collider(this.groundLayer, this.bluePlayer)

    this.physics.add.overlap(
      this.players,
      this.buttons,
      this.touchButton,
      null,
      this,
    )

    this.physics.add.overlap(this.players, this.exitLayer)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceKey = this.input.keyboard.addKey('SPACE')
    this.zKey = this.input.keyboard.addKey('Z')
    this.xKey = this.input.keyboard.addKey('X')
    this.zKey.addListener('down', () => this.activePlayer.action())
    this.spaceKey.addListener('down', () => this.activePlayer.action())
    this.xKey.addListener('down', () => this.swap())

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
    this.activePlayer.deactivate()

    if (this.activePlayer === this.redPlayer) {
      this.activePlayer = this.greenPlayer
    } else if (this.activePlayer === this.greenPlayer) {
      this.activePlayer = this.bluePlayer
    } else if (this.activePlayer === this.bluePlayer) {
      this.activePlayer = this.redPlayer
    }
    this.activePlayer.activate()
    this.cameras.main.startFollow(this.activePlayer)
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.activePlayer.walk(-1)
    } else if (this.cursors.right.isDown) {
      this.activePlayer.walk(1)
    } else {
      this.activePlayer.stop()
    }
  }

  collectCoin(sprite, tile) {
    this.exitLayer.removeTileAt(tile.x, tile.y)
    this.score++
  }

  touchButton(player, button) {
    if (button.isPressed) {
      return
    }
    button.isPressed = true
    this.toggleWalls.forEach((t) => {
      if (t.index === 5 && button.type === 'red') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y), button)
      }
      if (t.index === 6 && button.type === 'green') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y), button)
      }
      if (t.index === 7 && button.type === 'blue') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y), button)
      }
    })
  }

  toggleTile(tile, button) {
    tile.setCollision(false, false, false, false)
    tile.alpha = 0.2
    this.time.addEvent({
      delay: 100,
      callback: () => {
        tile.setCollision(true, true, true, true)
        tile.alpha = 1
        button.isPressed = false
      },
    })
  }
}
