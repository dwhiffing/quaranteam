import { MAPS } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()
    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60,
      )
    })
    MAPS.forEach((map) =>
      this.load.tilemapTiledJSON(`map${map}`, `assets/maps/map${map}.json`),
    )
    this.load.image('left', 'assets/images/left.png')
    this.load.image('up', 'assets/images/up.png')
    this.load.image('down', 'assets/images/down.png')
    this.load.image('right', 'assets/images/right.png')
    this.load.image('jump', 'assets/images/jump.png')
    this.load.image('swap', 'assets/images/swap.png')
    this.load.image('playButton', 'assets/images/play.png')
    this.load.image('helpButton', 'assets/images/help.png')
    this.load.image('restart', 'assets/images/restart.png')
    this.load.image('exit', 'assets/images/exit.png')
    this.load.spritesheet('tilemap', 'assets/images/tilemap.png', {
      frameWidth: 63,
      frameHeight: 63,
    })

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Menu')
    })
  }
}
