import { Ruta } from '../types/ruta';
import { RutaModel } from '../../../shared/db/models/ruta-model';
import { EmpresaModel } from '../../../shared/db/models/empresa-model';
import { Op } from 'sequelize';
import { sequelize } from '../../../shared/db/database';
import { WhereOptions } from 'sequelize/types/model';

// TODO: como es mas facil para el admin buscar por nombre_ruta, destino o empresa y para no comprometer la id de las rutas, el sistema debe hacer la busqueda con los metodos siguientes y recuperar la id para hacer delete o put
export class RutaRepository {
  //obtener todas las Ruta
  async findAllRutas(): Promise<Ruta[]> {
    const rutas = await RutaModel.findAll();

    return rutas.map((c) => c.toJSON() as Ruta);
  }

  async findAllRutasActivas(): Promise<Ruta[]> {
    const rutas = await RutaModel.findAll({ where: { estado: 'Activa' } });
    return rutas.map((c) => c.toJSON() as Ruta);
  }

  private async findRuta(where: WhereOptions<RutaModel>): Promise<Ruta | null> {
    const ruta = await RutaModel.findOne({ where });
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }

  //obtener rutas por nombre_ruta, destino o empresa usando los index de la db
  // sirven para la verificacion de existencia en la base de datos para evitar duplicados o mejorar la busqueda
  // id_ruta
  // async findRutaById(id_ruta: string): Promise<Ruta | null> {
  //   return this.findRuta({ id_ruta });
  // }
  // nombre_ruta
  async findRutaById(id_ruta: string): Promise<Ruta | null> {
    const ruta = await RutaModel.findByPk(id_ruta);
    return ruta ? (ruta.toJSON() as Ruta) : null;
  }

  async findRutaByNombre(nombre_ruta: string): Promise<Ruta | null> {
    return this.findRuta({ nombre_ruta });
  }
  // Destino
  async findRutaByDestino(destino: string): Promise<Ruta | null> {
    return this.findRuta({ destino });
  }
  // id_empresa
  async findRutaByEmpresa(id_empresa: string): Promise<Ruta | null> {
    return this.findRuta({ id_empresa });
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
  // async deleteRuta(nombre_ruta: string): Promise<boolean> {
  //   const deleted = await RutaModel.destroy({ where: { nombre_ruta } });
  //   return deleted > 0;
  // }
}
