export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' })
  }

  init(opts = {}) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.score = opts.score || 0
  }

  create() {
    this.add
      .image(20, 20, 'restart')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Menu')
      })

    this.add
      .text(this.width / 2, 100, 'Credits', {
        fontSize: 60,
        fontFamily: 'Sailec',
        fontWeight: '500',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)
    const names = [
      'Dan Whiffing',
      'Ash Dadoun',
      'Steph Braithwaite',
      'Sam Braithwaite',
    ]
    names.forEach((name, index) => {
      this.add
        .text(this.width / 2, this.height / 2 + index * 25, name, {
          fontSize: 20,
          fontFamily: 'Sailec',
          fontWeight: '500',
          color: '#fff',
          align: 'center',
        })
        .setOrigin(0.5)
    })
  }
}
