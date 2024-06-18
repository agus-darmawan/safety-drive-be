import { Response } from "@adonisjs/core/http";

export const responseUtil = {
  success: (response: Response, data?: any, message: string = 'Success') => {
    return response.status(200).json({ message, data });
  },
  created: (response: Response, data: any, message: string = 'Resource created successfully') => {
    return response.status(201).json({ message, data });
  },
  conflict: (response: Response, message: string = 'Resource already exists') => {
    return response.status(409).json({ message });
  },
  notFound: (response: Response, message: string = 'Resource not found') => {
    console.log(message);
    return response.status(404).json({ message });
  },
  noContent: (response: Response, message: string = 'Resource deleted successfully') => {
    return response.status(204).json({ message });
  }
};