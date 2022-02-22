import request from '../context/interceptor'; 

export class EmpleadoService {

    async getAll(activo) {
       const res = await request.get('Empleados/?activo='+activo); 
        return res.data; 
    }
}