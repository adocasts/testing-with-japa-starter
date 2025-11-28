import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Greet extends BaseCommand {
  static commandName = 'greet'
  static description = 'Prints a greeting to the name provided'

  static options: CommandOptions = {}

  @args.string()
  declare name: string

  async run() {
    this.logger.log(`Hello ${this.name}!`)
  }
}
