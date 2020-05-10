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
    this.background = this.add
      .tileSprite(0, 0, 1920, 1080, 'background')
      .setScrollFactor(0)
      .setTint(0x73cd4b, 0x1ea7e1, 0x73cd4b, 0x1ea7e1)
    this.add.image(this.width / 2, this.height / 2 - 120, 'about')
    this.add
      .image(20, 20, 'exit')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Menu')
      })

    this.add
      .text(
        this.width / 2,
        this.height / 2,
        'Use each of the characters to escape together. \nUse the onscreen controls or Arrows + Z and X to move around.',
        {
          fontSize: 20,
          fontFamily: 'Sailec',
          fontWeight: '500',
          color: '#fff',
          align: 'center',
        },
      )
      .setOrigin(0.5)

    const names = [
      'Code & Levels:  Dan Whiffing',
      'Art:  Ash Dadoun, Steph & Sam Braithwaite',
      'Music:  Purple Planet',
    ]
    names.forEach((name, index) => {
      this.add
        .text(this.width / 2, this.height / 2 + index * 25 + 90, name, {
          fontSize: 20,
          fontFamily: 'Sailec',
          fontWeight: '500',
          color: '#fff',
          align: 'center',
        })
        .setOrigin(0.5)
    })
    this.iter = 0
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
  }

  update() {
    this.background.tilePositionX = Math.cos(-this.iter) * 400
    this.background.tilePositionY = Math.sin(-this.iter) * 400

    this.iter += 0.005
  }
}
