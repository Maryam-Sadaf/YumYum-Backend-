import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserSignUpValidator {
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
      rules.alpha({
        allow: ['space']
      }),
      rules.required()
    ]),
    phone_number: schema.string([
      rules.unique({ table: 'users', column: 'phone_number' }),
      rules.regex(/^\+\d{12}$/),
      rules.required()
    ]),
    password: schema.string([
      rules.minLength(8),
      rules.maxLength(20),
      rules.required()
    ]),
    address: schema.string([
      rules.required()
    ])
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
    'name.alpha': 'The name should contain only characters and spaces',
    'name.required': 'Name field can not be empty',
    'phone_number.unique': 'This phone_number is already exists',
    'phone_number.regex': 'The regex rule for phone_number voilets',
    'phone_number.required': 'Phone_number field can not be empty',
    'password.minLength': 'Password must contain atleast eight characters',
    'password.maxLength': 'Password can contain atmost twenty characters',
    'password.required': 'Password field can not be empty',
    'address.required': 'Address field can not be empty',
  }
}
