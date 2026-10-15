export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: unknown;
    timestamp: string;
}

export class ResponseWrapper {
    static success<T>(data: T, message = 'Operación exitosa'): ApiResponse<T> {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }

    static error(message: string, error: unknown = null): ApiResponse<null> {
        return {
            success: false,
            message,
            error,
            timestamp: new Date().toISOString()
        };
    }
}
