import { Ruta } from '../types/ruta';
import { RutaModel } from '../../../shared/db/models/ruta-model';
import { EmpresaModel } from '../../../shared/db/models/empresa-model';
import { Op } from 'sequelize';
import { sequelize } from '../../../shared/db/database';

// TODO: como es mas facil para el admin buscar por nombre_ruta, destino o empresa y para no comprometer la id de las rutas, el sistema debe hacer la busqueda con los metodos siguientes y recuperar la id para hacer delete o put
export class RutaRepository {
  //obtener todas las Ruta
  async findAllRutas(): Promise<Ruta[]> {
    const rutas = await RutaModel.findAll();

    return rutas.map((c) => c.toJSON() as Ruta);
  }

  //obtener rutas por nombre_ruta, destino o empresa usando los index de la db
  // sirven para la verificacion de existencia en la base de datos para evitar duplicados o mejorar la busqueda
  //nombre_ruta
  async findRutaById(id_ruta: string): Promise<Ruta | null> {
    const ruta = await RutaModel.findByPk(id_ruta);
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }
  //nombre_ruta
  async findRutaByNombre(nombre_ruta: string): Promise<Ruta | null> {
    const ruta = await RutaModel.findOne({
      where: { nombre_ruta },
    });
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }
  //Destino
  async findRutaByDestino(destino: string): Promise<Ruta | null> {
    const ruta = await RutaModel.findOne({
      where: { destino },
    });
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }
  // empresa
  async findRutaByEmpresa(id_empresa: string): Promise<Ruta | null> {
    const ruta = await RutaModel.findOne({ where: { id_empresa } });
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }
  //coordenadas
  async findRutaByCoordenadas(coordenadas: string): Promise<Ruta | null> {
    const ruta = await RutaModel.findOne({ where: { coordenadas } });
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }

  //desacoplar
  async findEmpresaByNombre(nombre_empresa: string): Promise<string | null> {
    const empresa = await EmpresaModel.findOne({ where: { nombre_empresa } });
    return empresa ? empresa.id_empresa : null;
  }
  //desacoplar
  async findEmpresaById(id_empresa: string): Promise<string | null> {
    const empresa = await EmpresaModel.findByPk(id_empresa);
    return empresa ? empresa.nombre_empresa : null;
  }

  async findDuplicateRoute(id_empresa: string, geoJson: any) {
    return await RutaModel.findOne({
      where: {
        id_empresa,
        // Compara si la geometría guardada es igual a la nueva
        [Op.and]: sequelize.where(
          sequelize.fn(
            'ST_Equals',
            sequelize.col('coordenadas'),
            sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(geoJson)),
          ),
          true,
        ),
      },
    });
  }

  // crea una nuevo ruta en la base de datos, recibe un objeto con los datos de la ruta excepto la descripcion
  // TODO: verficiar y configurar la opcionalidad del campo descripcion
  async createRuta(data: any): Promise<Ruta> {
    const newRuta = await RutaModel.create(data, { include: ['empresa'] });
    return newRuta.toJSON() as Ruta;
  }

  //actualizar ruta
  async updateRuta(
    rutaParametro: string,
    data: Partial<Ruta>,
  ): Promise<Ruta | null> {
    const ruta = await RutaModel.findByPk(rutaParametro);
    if (!ruta) {
      return null;
    }
    await ruta.update(data);
    return ruta.toJSON() as Ruta;
  }

  //eliminar ruta
  async deleteRuta(nombre_ruta: string): Promise<boolean> {
    const deleted = await RutaModel.destroy({ where: { nombre_ruta } });
    return deleted > 0;
  }
}
