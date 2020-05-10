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
          this.width / 2 - 150 + 75 * map,
          this.height / 2 + 50,
          'playButton',
        )
        .setScale(1)
        .setInteractive()
        .on('pointerdown', () => {
          this.scene.start('Game', { levelNumber: map })
        }),
    )
    this.add
      .text(this.width / 2, this.height / 2 - 50, 'Levels', {
        fontSize: 60,
        fontFamily: 'Sailec',
        fontWeight: '500',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)
  }
}
