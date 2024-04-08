import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Restaurant from './Restaurant'
import Cart from './Cart'
import OrderDetail from './OrderDetail'

export default class Dish extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public restaurantId: number
  
  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public image: string

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Restaurant)
  public restaurant: BelongsTo<typeof Restaurant>

  @hasMany(() => OrderDetail)
  public order_details: HasMany<typeof OrderDetail>

  @manyToMany(() => Cart, {
    localKey: 'id',
    pivotForeignKey: 'dish_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'cart_id',
    pivotTable: 'dish_carts',
    pivotTimestamps: true
  })
  public carts: ManyToMany<typeof Cart>
}
