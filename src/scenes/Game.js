import { Player } from '../sprites/Player'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.collectCoin = this.collectCoin.bind(this)
    this.touchButton = this.touchButton.bind(this)
    this.toggleTile = this.toggleTile.bind(this)
    this.touchExit = this.touchExit.bind(this)
  }

  init() {}

  create() {
    this.map = this.make.tilemap({ key: 'map' })

    const groundTiles = this.map.addTilesetImage('tiles')
    this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])

    this.players = this.add.group()
    this.buttons = this.physics.add.group()
    this.coins = this.physics.add.group()
    this.exits = this.physics.add.group()
    this.crates = this.physics.add.group()

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
          .sprite(object.x, object.y, 'objects')
          .setOrigin(0, 1)
        this.coins.add(coin)
        coin.body.setAllowGravity(false)
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
      }

      if (object.type === 'crate') {
        const crate = this.add
          .sprite(object.x, object.y, 'objects')
          .setOrigin(0, 1)
          .setFrame(3)
        this.crates.add(crate)
        crate.body.setCollideWorldBounds(true)

        crate.body.useDamping = true
        crate.body.setDrag(0.8, 0.8)
      }

      if (object.type === 'exit') {
        const exit = this.add
          .sprite(object.x, object.y, 'objects')
          .setOrigin(0, 1)
          .setFrame(14)
        this.exits.add(exit)
        exit.body.setAllowGravity(false)
      }
    })

    this.physics.world.bounds.width = this.groundLayer.width
    this.physics.world.bounds.height = this.groundLayer.height

    this.activePlayer = this.redPlayer
    this.activePlayer.activate()
    this.players.add(this.redPlayer)
    this.players.add(this.greenPlayer)
    this.players.add(this.bluePlayer)

    this.physics.add.collider(this.groundLayer, this.players)
    this.physics.add.collider(this.crates, this.players)
    this.physics.add.collider(this.groundLayer, this.crates)
    this.physics.add.overlap(
      this.crates,
      this.buttons,
      this.touchButton,
      null,
      this,
    )

    this.physics.add.overlap(
      this.players,
      this.coins,
      this.collectCoin,
      null,
      this,
    )

    this.physics.add.overlap(
      this.players,
      this.buttons,
      this.touchButton,
      null,
      this,
    )

    this.physics.add.overlap(
      this.players,
      this.exits,
      this.touchExit,
      null,
      this,
    )

    this.physics.add.overlap(this.players, this.exitLayer)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceKey = this.input.keyboard.addKey('SPACE')
    this.zKey = this.input.keyboard.addKey('Z')
    this.xKey = this.input.keyboard.addKey('X')
    this.rKey = this.input.keyboard.addKey('R')
    this.zKey.addListener('down', () => this.activePlayer.action())
    this.spaceKey.addListener('down', () => this.activePlayer.action())
    this.xKey.addListener('down', () => this.swap())
    this.rKey.addListener('down', () => this.scene.restart('Game'))

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
    const players = this.players.getChildren().filter((p) => p.visible)
    const activeIndex = players.findIndex((p) => p.alpha === 1)
    this.activePlayer.stop()
    this.activePlayer.deactivate()
    const nextIndex = activeIndex + 1 > players.length - 1 ? 0 : activeIndex + 1
    this.activePlayer = players[nextIndex]

    this.activePlayer.activate()
    this.cameras.main.startFollow(this.activePlayer)
  }

  update(time, delta) {
    this.activePlayer.update()
    if (this.cursors.left.isDown) {
      this.activePlayer.walk(-1)
    } else if (this.cursors.right.isDown) {
      this.activePlayer.walk(1)
    } else {
      this.activePlayer.stop()
    }
  }

  collectCoin(player, coin) {
    coin.destroy()
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
      delay: 200,
      callback: () => {
        tile.setCollision(true, true, true, true)
        tile.alpha = 1
        button.isPressed = false
      },
    })
  }

  touchExit(player, exit) {
    player.setVisible(false)
  }
}
