import type {
    Request,
    Response,
    NextFunction
} from 'express';

import { IEmployeeRepository }
    from '../repositories/IEmployeeRepository';
import { ResponseWrapper }
    from '../utils/response.wrapper';

export class EmpleadosController {

    constructor(
        private readonly repository: IEmployeeRepository
    ) {}

    getEmpleados = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const empleados =
                await this.repository.findAll();

            res.status(200).json(
                ResponseWrapper.success(
                    empleados,
                    'Listado de empleados obtenido exitosamente'
                )
            );
        } catch (error) {
            next(error);
        }
    };

    getEmpleadoById = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            const empleado =
                await this.repository.findById(id);

            if (!empleado) {
                res.status(404).json(
                    ResponseWrapper.error('Empleado no encontrado')
                );
                return;
            }

            res.status(200).json(
                ResponseWrapper.success(
                    empleado,
                    'Empleado obtenido exitosamente'
                )
            );
        } catch (error) {
            next(error);
        }
    };

    addEmpleado = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const empleado =
                await this.repository.create(req.body);

            res.status(201).json(
                ResponseWrapper.success(
                    empleado,
                    'Empleado registrado exitosamente'
                )
            );
        } catch (error) {
            next(error);
        }
    };

    updateEmpleado = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            const empleado =
                await this.repository.update(
                    id,
                    req.body
                );

            if (!empleado) {
                res.status(404).json(
                    ResponseWrapper.error('Empleado no encontrado')
                );
                return;
            }

            res.status(200).json(
                ResponseWrapper.success(
                    empleado,
                    'Empleado actualizado exitosamente'
                )
            );
        } catch (error) {
            next(error);
        }
    };

    deleteEmpleado = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            const eliminado =
                await this.repository.delete(id);

            if (!eliminado) {
                res.status(404).json(
                    ResponseWrapper.error('Empleado no encontrado')
                );
                return;
            }

            res.status(200).json(
                ResponseWrapper.success(
                    null,
                    'Empleado eliminado correctamente'
                )
            );
        } catch (error) {
            next(error);
        }
    };
}