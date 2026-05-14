import { EmpresaModel } from '../../../shared/db/models/empresa-model';

export class EmpresaRepository {
  async findEmpresaByNombre(nombre_empresa: string): Promise<string | null> {
    const empresa = await EmpresaModel.findOne({ where: { nombre_empresa } });
    return empresa ? empresa.id_empresa : null;
  }
}
