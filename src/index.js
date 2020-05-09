import Phaser from 'phaser'
import * as scenes from './scenes'

const game = new Phaser.Game({
  transparent: true,
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1920,
  height: 1080,
  input: {
    activePointers: 3,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      // debug: true,
    },
  },
  scene: Object.values(scenes),
})

export default game
