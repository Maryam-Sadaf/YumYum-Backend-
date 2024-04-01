import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ManyToMany, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Dish from './Dish'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public totalPrice: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Dish, {
    localKey: 'id',
    pivotForeignKey: 'cart_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'dish_id',
    pivotTable: 'dish_carts',
    pivotTimestamps: true
  })
  public dishes: ManyToMany<typeof Dish>
}
