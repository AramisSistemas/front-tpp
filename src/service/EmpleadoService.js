import request from '../context/interceptor'; 

export class EmpleadoService {

    async getAll(activo) {
       const res = await request.get('Empleados/?activo='+activo); 
        return res.data; 
    }

    async getOSociales() {
        const res = await request.get('Empleados/GetOsocial'); 
         return res.data; 
     }

     async getEmbargos() {
        const res = await request.get('Empleados/EmbargosGet'); 
         return res.data; 
     }
 
}