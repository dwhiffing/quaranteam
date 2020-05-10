import InputService from '../services/input'
import LevelService from '../services/level'
import { MAPS } from '../constants'

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
    this.background = this.add
      .tileSprite(0, 0, 1920, 1080, 'background')
      .setScrollFactor(0)

    const level = new LevelService(this, `map${MAPS[this.levelNumber - 1]}`)
    this.level = level
    this.width = level.map.widthInPixels
    this.height = level.map.heightInPixels

    this.physics.world.bounds.width = this.width
    this.physics.world.bounds.height = this.height
    this.physics.add.collider(level.pushers, level.groundLayer)
    this.physics.add.collider(level.pushers, level.pushers)
    this.physics.add.overlap(level.pushers, level.buttons, this.overlap)
    this.physics.add.overlap(level.players, level.pickups, this.overlap)

    this.cameras.main.setBounds(0, 0, this.width, this.height)
    this.cameras.main.setBackgroundColor('#555577')
    this.activePlayer = Phaser.Math.RND.pick(level.players.getChildren())
    this.cameras.main.setLerp(0.2, 0.2)
    this.activePlayer.activate()

    this.inputService = new InputService(this)

    this.muteButton = this.add
      .image(80, 35, 'mute')
      .setScale(0.5)
      .setScrollFactor(0)
      .setFrame(window.muted ? 1 : 0)
      .setInteractive()
      .on('pointerdown', () => {
        window.muted = !window.muted
        localStorage.setItem('muted', !!window.muted ? 1 : 0)
        this.sound.mute = !!window.muted
        this.muteButton.setFrame(window.muted ? 1 : 0)
      })
    this.iter = 0
  }

  swap() {
    const players = this.level.players.getChildren().filter((p) => p.visible)
    const activeIndex = players.findIndex((p) => p.alpha === 1)
    if (players.length > 0) {
      this.activePlayer.deactivate()
      const nextIndex = activeIndex + 1 >= players.length ? 0 : activeIndex + 1
      this.activePlayer = players[nextIndex]
      this.activePlayer.activate()
    }
  }

  update(time, delta) {
    this.iter += 0.001
    this.background.tilePositionX = Math.cos(-this.iter) * 400
    this.background.tilePositionY = Math.sin(-this.iter) * 400
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
    object.overlap(player, () => {
      if (
        (object.type === 'button' && object.name === player.name) ||
        object.name === 'any' ||
        player.name === 'any'
      ) {
        this.level.toggleWalls(object.name)
      }
    })
  }

  nextLevel() {
    if (this.levelNumber >= MAPS.length) return
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
