import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UserValidator {
  /**
   * Construtor
   * @param ctx
   */
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    phone: schema.string({}, [rules.phone()]),
    name: schema.string({}, [rules.nameSurname()]),
    role: schema.enum(['prefectureAdmin', 'placeAdmin', 'queueObserver', 'superAdmin'] as const),
    prefectureId: schema.string(),
    placeId: schema.string.optional({}, [rules.requiredWhen('role', 'in', ['placeAdmin', 'queueObserver'])])
  });

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
  public messages = {
    required: '{{ field }} é obrigatório para o convite.',
    enum: 'O campo {{ field }} deve ser um dentre {{ options.choices }}.',
    requiredWhen: 'O valor {{ field }} é necessário quando {{ options.otherField }} é {{ options.value }}.'
  };
}
