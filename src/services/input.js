export default class InputService {
  constructor(scene) {
    this.scene = scene
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
    this.zKey = this.scene.input.keyboard.addKey('Z')
    this.xKey = this.scene.input.keyboard.addKey('X')
    this.rKey = this.scene.input.keyboard.addKey('R')
    this.zKey.addListener('down', () => this.scene.activePlayer.action())
    this.spaceKey.addListener('down', () => this.scene.activePlayer.action())
    this.xKey.addListener('down', () => this.scene.swap())
    this.rKey.addListener('down', () => this.scene.scene.restart('Game'))

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
