import { Player } from '../sprites/Player'
import { ObjectSprite, NAMES } from '../sprites/Object'

export default class LevelService {
  constructor(scene, key) {
    this.scene = scene
    this.toggleWalls = this.toggleWalls.bind(this)
    this.toggleTile = this.toggleTile.bind(this)
    this.map = scene.make.tilemap({ key })

    const groundTiles = this.map.addTilesetImage('tilemap')
    this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])

    this.players = scene.add.group()
    this.ladders = scene.physics.add.group({ allowGravity: false })
    this.buttons = scene.physics.add.group({ allowGravity: false })
    this.coins = scene.physics.add.group({ allowGravity: false })
    this.exits = scene.physics.add.group({ allowGravity: false })
    this.crates = scene.physics.add.group()

    this.togglableWalls = this.groundLayer
      .getTilesWithinWorldXY(0, 0, 999999, 999999)
      .filter(
        (tile) =>
          tile.index === 196 || tile.index === 226 || tile.index === 225,
      )

    this.objLayer = this.map.getObjectLayer('Objects')
    this.objLayer.objects.forEach((object) => {
      if (object.type === 'spawn') {
        this[`${object.name}Player`] = new Player(scene, object)
      }

      Object.keys(NAMES).forEach((type) => {
        if (object.type === type) {
          this[`${type}s`].add(new ObjectSprite(scene, object))
        }
      })
    })

    this.players.add(this.redPlayer)
    this.players.add(this.greenPlayer)
    this.players.add(this.bluePlayer)

    this.pushers = [this.players, this.crates]
    this.pickups = [this.buttons, this.coins, this.exits, this.ladders]
  }

  toggleWalls(name) {
    this.togglableWalls.forEach((t) => {
      if (t.index === 225 && name === 'red') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y))
      }
      if (t.index === 196 && name === 'green') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y))
      }
      if (t.index === 226 && name === 'blue') {
        this.toggleTile(this.groundLayer.getTileAt(t.x, t.y))
      }
    })
  }

  toggleTile(tile) {
    this.groundLayer.setCollision([tile.index], false)
    tile.alpha = 0.2
    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        this.groundLayer.setCollision([tile.index], true)
        tile.alpha = 1
      },
    })
  }
}
