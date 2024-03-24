import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Restaurant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ownerName: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public address: string

  @column()
  public phoneNumber: string

  @column()
  public licenseKey: string

  @column.dateTime()
  public openTime: DateTime

  @column.dateTime()
  public closeTime: DateTime
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
