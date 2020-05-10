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
    this.load.audio('menuMusic', 'assets/audio/menu.mp3')
    this.load.audio('gameMusic', 'assets/audio/game.mp3')
    this.load.audio('jump', 'assets/audio/jump.mp3')
    this.load.audio('swap', 'assets/audio/swap.mp3')
    this.load.audio('button', 'assets/audio/button.mp3')
    this.load.audio('win', 'assets/audio/win.mp3')
    this.load.image('left', 'assets/images/left.png')
    this.load.image('background', 'assets/images/background.jpg')
    this.load.image('title', 'assets/images/title.png')
    this.load.image('about', 'assets/images/about.png')
    this.load.image('levels', 'assets/images/levels.png')
    this.load.image('up', 'assets/images/up.png')
    this.load.image('down', 'assets/images/down.png')
    this.load.image('right', 'assets/images/right.png')
    this.load.image('jump', 'assets/images/jump.png')
    this.load.image('swap', 'assets/images/swap.png')
    this.load.image('playButton', 'assets/images/play.png')
    this.load.image('helpButton', 'assets/images/help.png')
    this.load.image('restart', 'assets/images/restart.png')
    this.load.image('exit', 'assets/images/exit.png')
    this.load.spritesheet('mute', 'assets/images/mute.png', {
      frameWidth: 100,
      frameHeight: 100,
    })
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
