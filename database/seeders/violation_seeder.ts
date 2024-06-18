import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Violation from '#models/violation'

export default class extends BaseSeeder {
  async run() {
    await Violation.createMany([
      {
        name: 'cigarette',
      },
      {
        name: 'phone',
      },
      {
        name: 'seatbelt',
      },
    ])
  }
}