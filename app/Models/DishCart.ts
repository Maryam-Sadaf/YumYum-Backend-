import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Cart from './Cart'
import Dish from './Dish'

export default class DishCart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @column()
  public dishId: number

  @column()
  public quantity: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Cart,{
    foreignKey: 'cartId'
  })
  public cart: BelongsTo<typeof Cart>
  
  @belongsTo(() => Dish,{
    foreignKey: 'dishId'
  })
  public dish: BelongsTo<typeof Dish>
}
