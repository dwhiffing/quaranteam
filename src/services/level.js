import { Player } from '../sprites/Player'
import { ObjectSprite, FRAMES } from '../sprites/Object'

export default class LevelService {
  constructor(scene) {
    this.scene = scene
    this.toggleWalls = this.toggleWalls.bind(this)
    this.toggleTile = this.toggleTile.bind(this)
    this.map = scene.make.tilemap({ key: 'map' })

    const groundTiles = this.map.addTilesetImage('tiles')
    this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])

    this.players = scene.add.group()
    this.buttons = scene.physics.add.group({ allowGravity: false })
    this.coins = scene.physics.add.group({ allowGravity: false })
    this.exits = scene.physics.add.group({ allowGravity: false })
    this.crates = scene.physics.add.group()

    this.togglableWalls = this.groundLayer
      .getTilesWithinWorldXY(0, 0, 999999, 999999)
      .filter((tile) => tile.index >= 5 && tile.index <= 7)

    this.objLayer = this.map.getObjectLayer('Objects')
    this.objLayer.objects.forEach((object) => {
      if (object.type === 'spawn') {
        this[`${object.name}Player`] = new Player(scene, object)
      }

      Object.keys(FRAMES).forEach((type) => {
        if (object.type === type) {
          this[`${type}s`].add(new ObjectSprite(scene, object))
        }
      })
    })

    this.players.add(this.redPlayer)
    this.players.add(this.greenPlayer)
    this.players.add(this.bluePlayer)

    this.pushers = [this.players, this.crates]
    this.pickups = [this.buttons, this.coins, this.exits]
  }

  toggleWalls(button) {
    this.togglableWalls.forEach((t) => {
      if (t.index === 5 && button.name === 'red') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y), button)
      }
      if (t.index === 6 && button.name === 'green') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y), button)
      }
      if (t.index === 7 && button.name === 'blue') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y), button)
      }
    })
  }

  toggleTile(tile, button) {
    tile.setCollision(false, false, false, false)
    tile.alpha = 0.2
    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        tile.setCollision(true, true, true, true)
        tile.alpha = 1
        button.isPressed = false
      },
    })
  }
}
