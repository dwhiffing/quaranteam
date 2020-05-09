export default class InputService {
  constructor(scene) {
    this.scene = scene
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
    this.zKey = this.scene.input.keyboard.addKey('Z')
    this.xKey = this.scene.input.keyboard.addKey('X')
    this.rKey = this.scene.input.keyboard.addKey('R')
    this.lastKey = this.scene.input.keyboard.addKey('N')
    this.nextKey = this.scene.input.keyboard.addKey('M')
    this.zKey.addListener('down', () => this.scene.activePlayer.action())
    this.spaceKey.addListener('down', () => this.scene.activePlayer.action())
    this.xKey.addListener('down', () => this.scene.swap())
    this.lastKey.addListener('down', () => {
      if (this.scene.levelNumber === 1) return
      this.scene.scene.start('Game', {
        levelNumber: this.scene.levelNumber - 1,
      })
    })
    this.nextKey.addListener('down', () => {
      if (this.scene.levelNumber >= 2) return
      this.scene.scene.start('Game', {
        levelNumber: this.scene.levelNumber + 1,
      })
    })
    this.rKey.addListener('down', () => {
      this.scene.scene.start('Game', { levelNumber: this.scene.levelNumber })
    })

    this.update = this.update.bind(this)
  }

  update(time, delta) {
    this.scene.activePlayer.update()
    if (this.cursors.left.isDown) {
      this.scene.activePlayer.walk(-1)
    } else if (this.cursors.right.isDown) {
      this.scene.activePlayer.walk(1)
    } else {
      this.scene.activePlayer.stop()
    }
  }
}
