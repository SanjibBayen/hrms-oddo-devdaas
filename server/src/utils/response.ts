import { Response } from 'express';

export class ApiResponse {
    static success(res: Response, data: any, message: string = 'Success', code: number = 200) {
        return res.status(code).json({ status: 'success', data, message });
    }

    static error(res: Response, message: string, code: number = 500, errorCode: string = 'ERROR') {
        return res.status(code).json({ status: 'error', code: errorCode, message });
    }

    static paginated(res: Response, data: any[], pagination: any, message: string = 'Success') {
        return res.status(200).json({ status: 'success', data, pagination, message });
    }
}