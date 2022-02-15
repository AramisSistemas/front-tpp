import request from '../context/interceptor'; 

export class OperationService {

    async getAll() {
       const res = await request.get('Operations'); 
        return res.data; 
    }

    async getManiobraByOperation(operation) {
        const res = await request.get('Operations/ManiobrasByOperation/?operation=' + operation);
        return res.data;
    }

    async getManiobrasActivas(finalizadas) {
        const res = await request.get('Operations/GetManiobrasActivas/?finalizada=' + finalizadas);   
        return res.data;
    } 

    async getTurnos(esquema) {
        const res = await request.get('Operations/GetTurnos/?esquema=' + esquema);    
        return res.data;
    } 

    async getManiobrasAll() {
        const res = await request.get('Operations/GetManiobras');     
        return res.data;
    } 
}
