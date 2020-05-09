import { NUM_LEVELS } from '../constants'

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
    for (let i = 1; i <= NUM_LEVELS; i++) {
      this.load.tilemapTiledJSON(`map${i}`, `assets/maps/map${i}.json`)
    }
    this.load.image('left', 'assets/images/left.png')
    this.load.image('right', 'assets/images/right.png')
    this.load.image('jump', 'assets/images/jump.png')
    this.load.image('swap', 'assets/images/swap.png')
    this.load.image('restart', 'assets/images/restart.png')
    this.load.spritesheet('tiles', 'assets/images/tiles.png', {
      frameWidth: 70,
      frameHeight: 70,
    })
    this.load.spritesheet('objects', 'assets/images/objects.png', {
      frameWidth: 70,
      frameHeight: 70,
    })
    this.load.atlas(
      'player',
      'assets/images/player.png',
      'assets/images/player.json',
    )

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Game')
    })
  }
}
