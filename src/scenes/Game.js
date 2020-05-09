import InputService from '../services/input'
import LevelService from '../services/level'
import { NUM_LEVELS } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.overlap = this.overlap.bind(this)
    this.swap = this.swap.bind(this)
    this.nextLevel = this.nextLevel.bind(this)
    this.prevLevel = this.prevLevel.bind(this)
  }

  init(opts) {
    this.levelNumber = opts.levelNumber || 1
  }

  create() {
    const level = new LevelService(this, `map${this.levelNumber}`)
    this.level = level
    this.width = level.map.widthInPixels
    this.height = level.map.heightInPixels

    this.inputService = new InputService(this)

    this.physics.world.bounds.width = this.width
    this.physics.world.bounds.height = this.height
    this.physics.add.collider(level.pushers, level.groundLayer)
    this.physics.add.collider(level.pushers, level.pushers)
    this.physics.add.overlap(level.pushers, level.buttons, this.overlap)
    this.physics.add.overlap(level.players, level.pickups, this.overlap)

    this.cameras.main.setBounds(0, 0, this.width, this.height)
    this.cameras.main.setBackgroundColor('#ccccff')
    this.activePlayer = level.redPlayer
    this.activePlayer.activate()
  }

  swap() {
    const players = this.level.players.getChildren().filter((p) => p.visible)
    const activeIndex = players.findIndex((p) => p.alpha === 1)
    this.activePlayer.deactivate()
    const nextIndex = activeIndex + 1 >= players.length ? 0 : activeIndex + 1
    this.activePlayer = players[nextIndex]
    this.activePlayer.activate()
  }

  update(time, delta) {
    this.inputService.update(time, delta)
    this.activePlayer.update()
    if (
      this.level &&
      this.level.players.getChildren().every((p) => !p.visible)
    ) {
      this.nextLevel()
    }
  }

  overlap(player, object) {
    object.overlap(player, (obj) => {
      if (obj.type === 'button' && obj.name === player.name) {
        this.level.toggleWalls(obj)
      }
    })
  }

  nextLevel() {
    if (this.levelNumber >= NUM_LEVELS) return
    this.inputService.cleanup()
    this.scene.start('Game', {
      levelNumber: this.levelNumber + 1,
    })
  }

  prevLevel() {
    if (this.levelNumber === 1) return
    this.inputService.cleanup()
    this.scene.start('Game', {
      levelNumber: this.levelNumber - 1,
    })
  }
}
