import request from '../context/interceptor';

export class UserService {

    async getAll() {
        const res = await request.get('Users'); 
        return res.data;
    }

    async getPerfiles() {
        const res = await request.get('Users/GetPerfiles'); 
        return res.data;
    }
}