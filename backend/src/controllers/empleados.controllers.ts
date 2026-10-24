import type {
    Request,
    Response,
    NextFunction
} from 'express';

import { IEmployeeRepository }
    from '../repositories/IEmployeeRepository';
import { ResponseWrapper }
    from '../utils/response.wrapper';
import { DiscordNotifier }
    from '../utils/discord.notifier';

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

            DiscordNotifier.notifyQueried(Array.isArray(empleados) ? empleados.length : 0);

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

            DiscordNotifier.notifyUpdated(id, empleado);

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

            DiscordNotifier.notifyCreated(empleado);

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

            DiscordNotifier.notifyUpdated(id, empleado);

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

            DiscordNotifier.notifyDeleted(id);

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

    getEmployees = this.getEmpleados;
    getEmpleado = this.getEmpleados;
    updateEmployee = this.updateEmpleado;
    deleteEmployee = this.deleteEmpleado;
}

export { EmpleadosController as EmployeeController };