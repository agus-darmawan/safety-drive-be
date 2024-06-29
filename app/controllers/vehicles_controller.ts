import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'
import Violation from '#models/violation';
import { responseUtil } from '../../helper/response_util.js';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import env from '#start/env'
import { v2 as cloudinary } from 'cloudinary';
import { DateTime } from 'luxon';

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
});

export default class VehiclesController {
  private checkBase64(base64String: string): string | null {
    const match = base64String.match(/^data:image\/(png|jpg|jpeg);base64,/);
    return match ? match[1] : null;
  }

  public async index({ response }: HttpContext) {
    try {
      const vehicles = await Vehicle.all();
      const data = await Promise.all(
        vehicles.map(async (vehicle) => {
          const violation = await Violation.find(vehicle.violationId);
          return {
            id: vehicle.id,
            name: vehicle.name,
            hullNum : vehicle.hullNum,
            violationId: vehicle.violationId,
            violationName: violation ? violation.name : null,
            filePath: vehicle.filePath,
            date: vehicle.createdAt,
          };
        })
      );
      return responseUtil.success(response, data, 'Vehicles fetched successfully');
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return responseUtil.notFound(response, 'Error fetching vehicles');
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const vehicle = await Vehicle.find(params.id);
      if (!vehicle) {
        return responseUtil.notFound(response, 'Vehicle not found');
      }
      return responseUtil.success(response, vehicle, 'Vehicle fetched successfully');
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return responseUtil.notFound(response, 'Error fetching vehicle');
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = await vine
        .compile(
          vine.object({
            name: vine.string(),
            hullNum: vine.number(),
            violationId: vine.number(),
            picture: vine.string(),
          })
        )
        .validate(request.all(), {
          messagesProvider: new SimpleMessagesProvider({
            'required': 'The {{ field }} field is required.',
          }),
        });

      const pictureExtension = this.checkBase64(data.picture);

      if (!pictureExtension) {
        console.log('Invalid picture format. Only jpg and png are allowed.');
        return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.');
      }

      const fiveMinutesAgo = DateTime.now().minus({ minutes: 5 }).toJSDate();

      const existingRecord = await Vehicle.query()
        .where('violationId', data.violationId)
        .andWhere('hullNum', data.hullNum)
        .andWhere('createdAt', '>=', fiveMinutesAgo)
        .first();

      if (existingRecord) {
        return responseUtil.conflict(response, 'A record with the same violation ID and hull number was created within the last 5 minutes.');
      }

      const pictureUploadResult = await cloudinary.uploader.upload(data.picture, {
        folder: `uploads/umkm_pictures/${data.violationId}`,
        public_id: `${data.violationId}_picture`
      });

      const vehicle = await Vehicle.create({
        name: data.name,
        violationId: data.violationId,
        hullNum: data.hullNum,
        filePath: pictureUploadResult.secure_url,
      });

      return responseUtil.created(response, vehicle, 'Vehicle created successfully');
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      return responseUtil.notFound(response, 'Error uploading images to Cloudinary');
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const vehicle = await Vehicle.find(params.id);
      if (!vehicle) {
        return responseUtil.notFound(response, 'Vehicle not found');
      }

      await vehicle.delete();
      return responseUtil.success(response, vehicle, 'Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return responseUtil.notFound(response, 'Error deleting vehicle');
    }
  }
}
