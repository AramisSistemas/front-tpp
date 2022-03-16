import request from '../context/interceptor';

export class OperationService {

    async getAll() {
        const res = await request.get('Operations');
        return res.data;
    }
 
    async GetLiquidacionByManiobra(maniobra, puesto) {
        const res = await request.get('Operations/GetLiquidacionByManiobra/?id=' + maniobra + '&puesto=' + puesto);
        return res.data;
    }

    async GetLiquidacionesByOp(operacion) {
        const res = await request.get('Operations/LiquidacionesByOp/?operacion=' + operacion);
        return res.data;
    }

    async getComposicionByManiobra(maniobra) {
        const res = await request.get('Operations/GetComposicionByManiobra/?id=' + maniobra)
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
