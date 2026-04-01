export interface Ruta {
  id_ruta: string;
  nombre_ruta: string;
  destino: string;
  descripcion: string;
  nombre_empresa?: string; // esto llega por un join y se inserta en el dto de respuesta
  estado: string;
  // Estructura GeoJSON real que devuelve PostGIS
  // El formato GeoJSON estándar para LineString
  coordenadas: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  colorhex: string;
}
