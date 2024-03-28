import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Restaurant from './Restaurant'

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
}
