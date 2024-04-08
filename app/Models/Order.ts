import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Restaurant from './Restaurant'
import OrderDetail from './OrderDetail'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public restaurantId: number

  @column()
  public orderNumber: string

  @column()
  public totalPrice: number

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => OrderDetail)
  public order_details: HasMany<typeof OrderDetail>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Restaurant)
  public restaurant: BelongsTo<typeof Restaurant>
}
