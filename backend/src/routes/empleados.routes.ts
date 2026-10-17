import { Router } from 'express';

import { EmpleadosController }
    from '../controllers/empleados.controllers';
import { MongooseEmployeeRepository }
    from '../repositories/MongooseEmployeeRepository';
import { validate }
    from '../middlewares/validate.middleware';
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
router.get(
    ['/empleados', '/employees'],
    empleadoController.getEmpleados
);

router.get(
    ['/empleados/:id', '/employees/:id'],
    validate({ params: employeeParamsSchema }),
    empleadoController.getEmpleadoById
);

router.post(
    ['/empleados', '/employees'],
    validate({ body: createEmployeeSchema }),
    empleadoController.addEmpleado
);

router.put(
    ['/empleados/:id', '/employees/:id'],
    validate({
        params: employeeParamsSchema,
        body: updateEmployeeSchema
    }),
    empleadoController.updateEmpleado
);

router.delete(
    ['/empleados/:id', '/employees/:id'],
    validate({ params: employeeParamsSchema }),
    empleadoController.deleteEmpleado
);

export default router;