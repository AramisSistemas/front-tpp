import request from '../context/interceptor';  

export class CompositionService {

    async getCompositions() {
       const res = await request.get('Composicions/GetCompositions'); 
        return res.data; 
    }

    async getAgrupaciones() {
        const res = await request.get('Composicions/GetAgrupaciones'); 
         return res.data; 
     }

     async getCompoJornales() {
        const res = await request.get('Composicions/GetCompoJornales'); 
         return res.data; 
     }

     async GetConceptosJornales(agrupacion) {
        const res = await request.get('Composicions/GetConceptosJornales/?agrupacion='+agrupacion); 
         return res.data; 
     }

     async getManiobras() {
        const res = await request.get('Composicions/GetManiobras'); 
         return res.data; 
     }

     async getPuestos() {
        const res = await request.get('Composicions/GetPuestos'); 
         return res.data; 
     }

     async getEsquemas() {
        const res = await request.get('Composicions/GetEsquemas'); 
         return res.data; 
     } 
}