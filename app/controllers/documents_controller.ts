import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class DocumentsController {
    public async index({ response }: HttpContext) {
        const reviewers = await Document.all()
        return responseUtil.success(response, reviewers, 'Documents retrieved successfully')
    }

    public async show({ params, response }: HttpContext) {
        const reviewer = await Document.find(params.id)
        if (!reviewer) {
          return responseUtil.notFound(response, 'Documet not found')
        }
        return responseUtil.success(response, reviewer, 'Document retrieved successfully')
    }

    public async store({ request, response }: HttpContext) {
        const data = await vine
          .compile(
            vine.object({
              name: vine.string(),
              about: vine.string(),
              number: vine.string(),
              date: vine.string(), 
            })
          )
          .validate(request.all(), {
            messagesProvider: new SimpleMessagesProvider({
              required: 'The {{ field }} field is required.',
            }),
          })
    
        const dateTime = DateTime.fromISO(data.date)
        const document = await Document.create({
          name: data.name,
          about: data.about,
          number: data.number,
          date: dateTime, 
        })
        return responseUtil.created(response, document, 'Document created successfully')
    }
}