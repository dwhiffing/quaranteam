import InputService from '../services/input'
import LevelService from '../services/level'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.overlap = this.overlap.bind(this)
  }

  init() {}

  create() {
    const level = new LevelService(this)
    this.level = level
    this.width = level.map.widthInPixels
    this.height = level.map.heightInPixels

    this.physics.world.bounds.width = level.groundLayer.width
    this.physics.world.bounds.height = level.groundLayer.height
    this.physics.add.collider(level.pushers, level.groundLayer)
    this.physics.add.collider(level.crates, level.players)
    this.physics.add.overlap(level.pushers, level.buttons, this.overlap)
    this.physics.add.overlap(level.players, level.pickups, this.overlap)

    this.cameras.main.zoom = 0.5
    this.cameras.main.setBounds(0, 0, this.width, this.height)
    this.cameras.main.setBackgroundColor('#ccccff')
    this.activePlayer = level.redPlayer
    this.activePlayer.activate()

    this.inputService = new InputService(this)
  }

  swap() {
    const players = this.level.players.getChildren().filter((p) => p.visible)
    const activeIndex = players.findIndex((p) => p.alpha === 1)
    this.activePlayer.deactivate()
    const nextIndex = activeIndex + 1 > players.length - 1 ? 0 : activeIndex + 1
    this.activePlayer = players[nextIndex]
    this.activePlayer.activate()
  }

  update(time, delta) {
    this.inputService.update(time, delta)
    this.activePlayer.update()
  }

  overlap(player, object) {
    object.overlap(player, (obj) => {
      if (obj.type === 'button') {
        this.level.toggleWalls(obj)
      }
    })
  }
}
