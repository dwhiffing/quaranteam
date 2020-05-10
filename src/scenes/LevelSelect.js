import { MAPS } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelect' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.background = this.add
      .tileSprite(0, 0, 1920, 1080, 'background')
      .setScrollFactor(0)
      .setTint(0x73cd4b, 0x1ea7e1, 0x73cd4b, 0x1ea7e1)
    this.add.image(this.width / 2, this.height / 2 - 70, 'levels')
    this.add
      .image(20, 20, 'exit')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Menu')
      })
    MAPS.forEach((map) =>
      this.add
        .image(
          this.width / 2 - 240 + 60 * map,
          this.height / 2 + 50,
          'playButton',
        )
        .setScale(1)
        .setInteractive()
        .on('pointerdown', () => {
          window.music.stop()
          window.music = this.sound.add('gameMusic')
          window.music.play()
          this.scene.start('Game', { levelNumber: map })
        }),
    )
    this.muteButton = this.add
      .image(this.width - 50, this.height - 50, 'mute')
      .setScale(0.5)
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

  update() {
    this.background.tilePositionX = Math.cos(-this.iter) * 400
    this.background.tilePositionY = Math.sin(-this.iter) * 400

    this.iter += 0.005
  }
}
