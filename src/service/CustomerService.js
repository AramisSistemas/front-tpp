import request from '../context/interceptor';  

export class CustomerService {

    async GetClientes() {
       const res = await request.get('Customers/GetClientes'); 
        return res.data; 
    }

    async GetDestinos() {
        const res = await request.get('Customers/GetDestinos'); 
         return res.data; 
     }

     async GetResponsabilidades() {
        const res = await request.get('Customers/GetResponsabilidades'); 
         return res.data; 
     }

     async GetGeneros() {
        const res = await request.get('Customers/GetGeneros'); 
         return res.data; 
     }

     async GetImputaciones() {
        const res = await request.get('Customers/GetImputaciones'); 
         return res.data; 
     }
 
}