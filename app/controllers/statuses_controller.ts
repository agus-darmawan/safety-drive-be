import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'
import { DateTime } from 'luxon'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class StatusesController {
  public async index({ response }: HttpContext) {
    const fifteenMinutesAgo = DateTime.now().minus({ minutes: 15 })

    const statuses = await Status.query()

    const result = statuses.map(status => {
      const isActive = status.createdAt > fifteenMinutesAgo || status.updatedAt > fifteenMinutesAgo
      return {
        id: status.id,
        hullNum: status.hullNum,
        status: isActive ? 'active' : 'inactive'
      }
    })

    return responseUtil.success(response, result, 'Statuses retrieved successfully')
  }

  public async update({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          hullNum: vine.string(),
          status: vine.boolean()
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    const { hullNum, status } = data

    let statusRecord = await Status.findBy('hullNum', hullNum)

    if (statusRecord) {
      statusRecord.merge({ status })
      await statusRecord.save()
      return responseUtil.success(response, statusRecord, 'Status updated successfully')
    } else {
      statusRecord = await Status.create({ hullNum, status })
      return responseUtil.created(response, statusRecord, 'Status created successfully')
    }
  }
}
