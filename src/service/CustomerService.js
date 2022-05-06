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
 
}