import { Router } from 'express';

import { EmpleadosController }
    from '../controllers/empleados.controllers';
import { MongooseEmployeeRepository }
    from '../repositories/MongooseEmployeeRepository';
import { validate }
    from '../middlewares/validate.middleware';
import { authenticateJWT }
    from '../shared/middlewares/auth.middleware';
import {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeParamsSchema
} from '../dtos/employee.dto';

const router = Router();

const empleadoRepository =
    new MongooseEmployeeRepository();

const empleadoController =
    new EmpleadosController(
        empleadoRepository
    );

// Rutas en español y alias en inglés (compatibilidad con stress-test.yml y PDF)
// GET: Abierto para lectura general de la rejilla
router.get(
    ['/empleados', '/employees'],
    empleadoController.getEmpleados
);

router.get(
    ['/empleados/:id', '/employees/:id'],
    validate({ params: employeeParamsSchema }),
    empleadoController.getEmpleadoById
);

// POST, PUT y DELETE: Protegidos transaccionalmente con authenticateJWT
router.post(
    ['/empleados', '/employees'],
    authenticateJWT as any,
    validate({ body: createEmployeeSchema }),
    empleadoController.addEmpleado
);

router.put(
    ['/empleados/:id', '/employees/:id'],
    authenticateJWT as any,
    validate({
        params: employeeParamsSchema,
        body: updateEmployeeSchema
    }),
    empleadoController.updateEmpleado
);

router.delete(
    ['/empleados/:id', '/employees/:id'],
    authenticateJWT as any,
    validate({ params: employeeParamsSchema }),
    empleadoController.deleteEmpleado
);

export default router;