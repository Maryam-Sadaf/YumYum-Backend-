import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RestaurantUpdateValidator {
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
    email: schema.string([
      rules.email(),
      rules.required()
    ]),
    address: schema.string([
      rules.required()
    ]),
    phone_number: schema.string([
      rules.regex(/^\+\d{12}$/),
      rules.required()
    ]),
    open_time: schema.date({
      format: 'HH:mm:ss'
    },[rules.required()]),
    close_time: schema.date({
      format: 'HH:mm:ss'
    },[rules.required()]),
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
    'owner_name.alpha': 'The name should contain only characters and spaces',
    'owner_name.required': 'Owner_name field can not be empty',
    'name.alphaNum': 'The restaurant name should contain only characters, space, dash, underscore and numbers',
    'name.required': 'Restaurant name field can not be empty',
    'email.email': 'The email is not valid',
    'email.required': 'Email field can not be empty',
    'address.required': 'Address field can not be empty',
    'phone_number.regex': 'The regex rule for phone_number voilets',
    'phone_number.required': 'Phone_number field can not be empty',
    'license_key.required': 'License field can not be empty',
    'open_time.required': 'Opening_time field can not be empty',
    'close_time.required': 'Closing_time field can not be empty',
  }
}
