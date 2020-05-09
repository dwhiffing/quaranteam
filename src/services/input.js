export default class InputService {
  constructor(scene) {
    this.scene = scene
    const DIST = 150
    const { height, width } = this.scene.cameras.main
    this.jump = this.jump.bind(this)
    this.restart = this.restart.bind(this)
    this.leftUp = this.leftUp.bind(this)
    this.leftDown = this.leftDown.bind(this)
    this.rightUp = this.rightUp.bind(this)
    this.rightDown = this.rightDown.bind(this)
    this.cleanup = this.cleanup.bind(this)
    this.update = this.update.bind(this)
    this.direction = 0
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const makeButton = (x, y, key, callback, scale = 2) => {
      if (!isMobile) return
      const image = this.scene.add.image(x, y, key)
      image
        .setScale(scale)
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', callback)
      return image
    }
    this.leftTouch = makeButton(DIST, height - DIST, 'left', this.leftDown)
    this.rightTouch = makeButton(
      DIST * 2.5,
      height - DIST,
      'right',
      this.rightDown,
    )
    isMobile && this.leftTouch.on('pointerup', this.leftUp)
    isMobile && this.rightTouch.on('pointerup', this.rightUp)
    makeButton(width - DIST, height - DIST, 'jump', this.jump)
    makeButton(width - DIST * 2.5, height - DIST, 'swap', this.scene.swap)
    makeButton(width - DIST, DIST, 'restart', this.restart)
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
    this.zKey = this.scene.input.keyboard.addKey('Z')
    this.xKey = this.scene.input.keyboard.addKey('X')
    this.rKey = this.scene.input.keyboard.addKey('R')
    this.lastKey = this.scene.input.keyboard.addKey('N')
    this.nextKey = this.scene.input.keyboard.addKey('M')
    this.cursors.left.addListener('down', this.leftDown)
    this.cursors.right.addListener('down', this.rightDown)
    this.cursors.left.addListener('up', this.leftUp)
    this.cursors.right.addListener('up', this.rightUp)
    this.zKey.addListener('down', this.jump)
    this.spaceKey.addListener('down', this.jump)
    this.xKey.addListener('down', this.scene.swap)
    this.lastKey.addListener('down', this.scene.prevLevel)
    this.nextKey.addListener('down', this.scene.nextLevel)
    this.rKey.addListener('down', this.restart)
  }

  leftDown() {
    this.direction = -1
  }

  rightDown() {
    this.direction = 1
  }

  leftUp() {
    this.direction = 0
  }

  rightUp() {
    this.direction = 0
  }

  jump() {
    this.scene.activePlayer.action()
  }

  restart() {
    this.scene.scene.start('Game', { levelNumber: this.scene.levelNumber })
  }

  cleanup() {
    this.nextKey.removeListener('down')
    this.lastKey.removeListener('down')
    this.rKey.removeListener('down')
    this.xKey.removeListener('down')
    this.spaceKey.removeListener('down')
    this.zKey.removeListener('down')
  }

  update() {
    if (this.direction !== 0) {
      this.scene.activePlayer.walk(this.direction)
    } else {
      this.scene.activePlayer.stop()
    }
  }
}
