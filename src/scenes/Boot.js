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

    this.load.tilemapTiledJSON('map1', 'assets/maps/map1.json')
    this.load.tilemapTiledJSON('map2', 'assets/maps/map2.json')
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
