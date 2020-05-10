export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    if (window.music) {
      window.music.stop()
    }
    window.muted = +localStorage.getItem('muted')
    window.music = this.sound.add('menuMusic')
    this.sound.mute = !!window.muted

    window.music.play()
    this.background = this.add
      .tileSprite(0, 0, 1920, 1080, 'background')
      .setScrollFactor(0)
      .setTint(0x73cd4b, 0x1ea7e1, 0x73cd4b, 0x1ea7e1)
    this.add.image(this.width / 2, this.height / 2 - 50, 'title')
    this.add
      .image(this.width / 2 - 50, this.height / 2 + 50, 'playButton')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('LevelSelect')
      })
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
    // setTimeout(() => this.muteButton.setFrame(window.muted ? 1 : 0), 0)
    this.add
      .image(this.width / 2 + 50, this.height / 2 + 50, 'helpButton')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Credits')
      })
    this.iter = 0
  }

  update() {
    this.background.tilePositionX = Math.cos(-this.iter) * 400
    this.background.tilePositionY = Math.sin(-this.iter) * 400

    this.iter += 0.005
  }
}
