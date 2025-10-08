import { useEffect, useState } from 'react';
import UsPlanCard from "./UsPlanCard";
import { DirectivityService } from '@/core/services/directivity/directivity.service';
import type { IDirectivity } from '@/core/types/IDirectivity';

export default function UsPlan() {
  const [directivityData, setDirectivityData] = useState<IDirectivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de la directiva
  useEffect(() => {
    const loadDirectivityData = async () => {
      try {
        const response = await DirectivityService.getAll();
        console.log('🔍 Respuesta completa de la API:', response);
        console.log('📊 Datos de directividades:', response.data);
        console.log('📈 Cantidad de directividades:', response.data?.length || 0);
        
        // Verificar si response.data existe y es un array
        if (response.data && Array.isArray(response.data)) {
          setDirectivityData(response.data);
          console.log('✅ Datos cargados exitosamente:', response.data.length, 'miembros');
        } else {
          console.warn('⚠️ response.data no es un array válido:', response.data);
          setDirectivityData([]);
        }
      } catch (error) {
        console.error('❌ Error loading directivity data:', error);
        setDirectivityData([]);
      } finally {
        setLoading(false);
      }
    };

    loadDirectivityData();
  }, []);

  // Crear highlights desde los datos de la directiva
  const highlights = directivityData.map((member) => ({
    label: `${member.position}:`,
    value: member.name,
  }));

  // Imprimir highlights generados para debugging
  console.log('🎯 Highlights generados:', highlights);
  console.log('👥 Datos de directivityData:', directivityData);
  console.log('🔄 Estado de loading:', loading);
  console.log('📊 Número de highlights:', highlights.length);
  return (
    <div className="flex flex-col">
        
      <UsPlanCard
        logo="logo"
        title="Planeamos con propósito, construimos con pasión"
        content={`Constructora Villa Bonita es una empresa que se dedica al diseño, construcción y comercialización de proyectos inmobiliarios y obras civiles en general, tanto propios como de terceros.

Nuestro trabajo se caracteriza por la calidad y la eficiencia en tiempos y costos en cada uno de sus trabajos.

Fundada en el año 2011, nació como un sueño de su Gerente General, el Ing. Willmar Guzmán, para afrontar la creciente demanda de proyectos inmobiliarios en la zona del Urubó y también para terminar de consolidar la Urbanización Villa Bonita.

A partir del 2016 toma un giro para no sólo dedicarse al ámbito inmobiliario, sino también a la participación de proyectos civiles en otros sectores como clientes particulares y licitaciones públicas.

Actualmente, contamos con varios proyectos terminados y entregados a clientes satisfechos, tanto privados como del ámbito público. Esto es gracias al gran equipo que conforma la Constructora, que no sólo son excelentes profesionales, sino que también son excelentes personas, compañeros y amigos.`}
        highlights={loading ? [
          { label: 'Cargando directiva...', value: '' }
        ] : highlights}
      />
    </div>
  );
}