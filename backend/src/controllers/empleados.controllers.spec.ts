import { Request, Response, NextFunction } from 'express';
import { EmpleadosController, EmployeeController } from './empleados.controllers';
import { IEmployeeRepository } from '../repositories/IEmployeeRepository';

describe('Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
    let controller: EmpleadosController;
    let mockRepository: jest.Mocked<IEmployeeRepository>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        // 1. Crear un Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        controller = new EmpleadosController(mockRepository);

        // 2. Mockear los objetos del ciclo de vida de Express
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockResponse = { status: statusMock };
        mockNext = jest.fn();
    });

    it('Debería inicializar el controlador correctamente con el repositorio inyectado', () => {
        expect(controller).toBeDefined();
        expect(controller).toBeInstanceOf(EmpleadosController);
    });

    describe('getEmpleado', () => {
        it('Debería retornar la lista de empleados con respuesta de éxito', async () => {
            const fakeEmployees = [
                { id: '1', nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 }
            ];

            mockRepository.findAll.mockResolvedValue(fakeEmployees);
            mockRequest = {};

            await controller.getEmpleado(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: fakeEmployees
                })
            );
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('Debería propagar el error al middleware mediante next() en caso de falla', async () => {
            const fakeError = new Error('Database connection failure');
            mockRepository.findAll.mockRejectedValue(fakeError);
            mockRequest = {};

            await controller.getEmpleado(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

            expect(mockNext).toHaveBeenCalledWith(fakeError);
        });
    });

    describe('getEmpleadoById', () => {
        it('Debería retornar un empleado si existe', async () => {
            const fakeEmployee = { id: '1', nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 };
            mockRepository.findById.mockResolvedValue(fakeEmployee);
            mockRequest = { params: { id: '1' } };

            await controller.getEmpleadoById(mockRequest as any, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: fakeEmployee
                })
            );
            expect(mockRepository.findById).toHaveBeenCalledWith('1');
        });

        it('Debería retornar 404 si el empleado no se encuentra', async () => {
            mockRepository.findById.mockResolvedValue(null);
            mockRequest = { params: { id: '999' } };

            await controller.getEmpleadoById(mockRequest as any, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Empleado no encontrado'
                })
            );
        });
    });

    describe('addEmpleado', () => {
        it('Debería crear un nuevo empleado y responder con status 201', async () => {
            const newEmployee = {
                nombre: 'Carlos Pérez',
                cargo: 'Desarrollador',
                departamento: 'Sistemas',
                sueldo: 3000
            };
            const createdEmployee = { id: '2', ...newEmployee };

            mockRepository.create.mockResolvedValue(createdEmployee);
            mockRequest = { body: newEmployee };

            await controller.addEmpleado(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: createdEmployee
                })
            );
            expect(mockRepository.create).toHaveBeenCalledWith(newEmployee);
        });
    });

    describe('updateEmployee', () => {
        it('Debería actualizar y retornar el empleado actualizado', async () => {
            const updateData = { cargo: 'Líder Técnico', sueldo: 4500 };
            const updatedEmployee = { id: '1', nombre: 'Andrés Mendoza', departamento: 'TI', ...updateData };

            mockRepository.update.mockResolvedValue(updatedEmployee);
            mockRequest = { params: { id: '1' }, body: updateData };

            await controller.updateEmployee(mockRequest as any, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: updatedEmployee
                })
            );
            expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
        });

        it('Debería retornar 404 si el empleado a actualizar no existe', async () => {
            mockRepository.update.mockResolvedValue(null);
            mockRequest = { params: { id: '999' }, body: { cargo: 'Director' } };

            await controller.updateEmployee(mockRequest as any, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Empleado no encontrado'
                })
            );
        });
    });

    describe('deleteEmployee', () => {
        it('Debería eliminar un empleado correctamente', async () => {
            mockRepository.delete.mockResolvedValue(true);
            mockRequest = { params: { id: '1' } };

            await controller.deleteEmployee(mockRequest as any, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Empleado eliminado correctamente'
                })
            );
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
        });

        it('Debería retornar 404 si el empleado a eliminar no existe', async () => {
            mockRepository.delete.mockResolvedValue(false);
            mockRequest = { params: { id: '999' } };

            await controller.deleteEmployee(mockRequest as any, mockResponse as Response, mockNext as NextFunction);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Empleado no encontrado'
                })
            );
        });
    });
});
