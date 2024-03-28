import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDishValidator {
  constructor(protected ctx: HttpContextContract) { }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string([
      rules.alphaNum({
        allow: ['space', 'dash', 'underscore',]
      }),
      rules.required()
    ]),
    description: schema.string([
      rules.required()
    ]),
    price: schema.number([
      rules.required(),
      rules.range(0, 5000)
    ]),
    image: schema.file({
      size: '5mb',
      extnames: ['jpg', 'png', 'svg', 'jpeg'],
    },[rules.required()])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'name.alpha': 'The Dish name should contain only characters, space, dash, and underscore',
    'name.required': 'Dish name field can not be empty',
    'description.required': 'Description field can not be empty',
    'price.required': 'Price field can not be empty',
    'price.range': 'Price must be non-negative number',
    'image.required': 'Image field can not be empty',
  }
}
