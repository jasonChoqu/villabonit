<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HistoriesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('histories')->insert([
            [
                'id' => 6,
                'title' => 'Visión pionera más allá del río',
                'description' => 'Visión pionera más allá del río',
                'content' => "Hasta principios de la década de 1980, la expansión urbana de Santa Cruz de la Sierra se limitaba al margen este del río Piraí. El cauce natural del río actuaba como frontera física y simbólica para el crecimiento de la ciudad. Sin puentes ni infraestructura que conectara con el otro lado, el oeste era considerado territorio rural, poco accesible y sin proyección urbana.\n\nEn ese contexto, mientras muchas familias buscaban migrar hacia el centro urbano, nació una visión contraria a la corriente predominante: cruzar el río Piraí con el propósito de invertir y desarrollar tierra en una zona prácticamente despoblada. Fue así como se adquirió la primera parcela, conocida como La Ponderosa, que en ese entonces funcionaba como una lechería. Con esta acción se sentaron las bases de lo que hoy conocemos como Villa Bonita.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-07 00:52:01'),
                'updated_at' => Carbon::parse('2025-09-10 20:29:45'),
            ],
            [
                'id' => 7,
                'title' => 'Desarrollo con recursos propios y compromiso comunitario',
                'description' => 'Desarrollo con recursos propios y compromiso comunitario',
                'content' => "El inicio del proyecto estuvo marcado por importantes desafíos financieros. Ante la imposibilidad de acceder a financiamiento bancario, los impulsores del proyecto decidieron vender sus propias viviendas en Santa Cruz para generar el capital inicial. Con esos recursos se construyó la primera avenida y se comenzaron a comercializar los primeros lotes. El modelo fue claro desde un principio: reinvertir constantemente a partir de las ventas, sin recurrir al endeudamiento.\n\nDurante más de 25 años, el proyecto ha experimentado un crecimiento sostenido, superando momentos de crisis económica nacional e internacional. Su evolución ha sido posible gracias a una planificación estratégica, a la reinversión permanente de los recursos y al compromiso con la comunidad.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:30:27'),
                'updated_at' => Carbon::parse('2025-09-10 20:30:27'),
            ],
            [
                'id' => 8,
                'title' => 'Infraestructura, servicios y organización social',
                'description' => 'Infraestructura, servicios y organización social',
                'content' => "Desde sus inicios, Villa Bonita ofreció terrenos urbanizados con acceso a servicios básicos, permitiendo a cada familia construir su vivienda de forma progresiva y de acuerdo a sus propias posibilidades. Esta modalidad promovió un desarrollo inclusivo y ordenado.\n\nCon la expansión del proyecto, surgió la necesidad de gestionar de forma autónoma el abastecimiento de agua potable y saneamiento básico. Como respuesta, se fundó la Cooperativa de Agua Potable y Servicios Sanitarios AGUAYSES, una entidad nacida desde la propia comunidad, que ha sido clave para garantizar la sostenibilidad operativa del proyecto.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:33:17'),
                'updated_at' => Carbon::parse('2025-09-10 20:33:17'),
            ],
            [
                'id' => 9,
                'title' => 'Adaptación al crecimiento regional',
                'description' => 'Adaptación al crecimiento regional',
                'content' => "El crecimiento económico de Santa Cruz, impulsado principalmente por la agroindustria y el sector energético, atrajo una fuerte inversión nacional e internacional. Esto incrementó significativamente la demanda habitacional, posicionando al departamento como el motor económico de Bolivia, con el mayor ingreso per cápita y aportando cerca de un tercio del PIB nacional.\n\nEn este contexto, Villa Bonita se integró naturalmente al desarrollo regional, adaptando su oferta y modelo de gestión a las nuevas exigencias del mercado. A diferencia de otros proyectos, que respond-ieron de manera especulativa, Villa Bonita mantuvo su enfoque social, comunitario y sostenible.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:33:43'),
                'updated_at' => Carbon::parse('2025-09-10 20:33:43'),
            ],
            [
                'id' => 10,
                'title' => 'Superación de barreras normativas',
                'description' => 'Superación de barreras normativas',
                'content' => "Uno de los desafíos más significativos fue la regulación urbanística del municipio de Porongo, al que pertenece la zona del Urubó. Durante años, las normativas exigían que los lotes tuvieran superficies mínimas de 600 m2 a 1200 m2, lo cual limitaba la densidad poblacional y restringía el acceso a terrenos para sectores medios.\n\nA partir del año 2014, la Alcaldía de Porongo reformuló su normativa, reconociendo la necesidad de promover un crecimiento más accesible y equilibrado. Esta adecuación permitió la implementación de lotes de menor superficie, acorde a las necesidades actuales de las familias, facilitando así el desarrollo urbano de proyectos como Villa Bonita.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:34:14'),
                'updated_at' => Carbon::parse('2025-09-10 20:34:14'),
            ],
            [
                'id' => 11,
                'title' => 'Nace la Constructora Villa Bonita: de proyecto a ejecución',
                'description' => 'Nace la Constructora Villa Bonita: de proyecto a ejecución',
                'content' => "Como resultado natural del crecimiento y de la necesidad de ejecutar obras de mayor envergadura con autonomía, surge la Constructora Villa Bonita, brazo técnico y operativo del proyecto. Esta constructora se creó para garantizar que cada etapa del desarrollo urbano se realizara con estándares de calidad, eficiencia y visión a largo plazo. Uno de los proyectos emblemáticos de esta etapa es la Avenida Marayau, una vía estructurante que atraviesa transversalmente Villa Bonita, uniendo distintas urbanizaciones y dando coherencia territorial a todo el desarrollo.\n\n\"La avenida Marayau surge como una necesidad interna del proyecto. No solo une las urbanizaciones ya establecidas, sino que también conecta todo lo que vendrá. Le da un eje lógico a la expansión futura.\"\n\nLa avenida fue concebida como una obra integral: doble vía, camellón ecológico central, pavimento de hormigón de 18 cm de espesor, luminarias LED, red de drenaje pluvial y servicios básicos soterrados. No solo cumple una función vial, sino que define el carácter del nuevo urbanismo que se desea implantar en la zona.\n\n\"En vez de depender de fondos externos, decidimos ejecutar esta obra con los mismos recursos que hemos generado en el tiempo. Eso nos da autonomía y nos permite mantener la calidad que buscamos en cada paso que damos.\"\n\nLa ejecución se dio de forma estratégica: la avenida nace desde el centro mismo de la urbanización y se extiende hasta el sector oeste, con el propósito de anticiparse al crecimiento futuro.\n\nEsta obra no responde únicamente a necesidades actuales, sino que proyecta la estructura vial para las siguientes generaciones.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:34:49'),
                'updated_at' => Carbon::parse('2025-09-10 20:34:49'),
            ],
            [
                'id' => 12,
                'title' => '"Esta avenida va a ser la base para todo lo que venga. Es la columna vertebral del desarrollo."',
                'description' => '"Esta avenida va a ser la base para todo lo que venga. Es la columna vertebral del desarrollo."',
                'content' => "La Constructora Villa Bonita no se limita a obras viales. Su campo de acción incluye la proyección de parques, sistemas de saneamiento, espacios comunitarios y la ejecución progresiva de un plan maestro urbano. Este plan contempla centros educativos, áreas comerciales, instituciones de salud, zonas recreativas, ciclo vías y nuevos polos de desarrollo económico.\n\nAdemás, todo esto se ejecuta con una visión de responsabilidad ambiental, respetando los espacios naturales, priorizando la eficiencia de los recursos y promoviendo la integración paisajística. La Constructora Villa Bonita es el vehículo que da forma y materializa la visión de crecimiento sostenible que ha guiado el proyecto desde sus inicios.",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:35:45'),
                'updated_at' => Carbon::parse('2025-09-10 20:35:45'),
            ],
            [
                'id' => 13,
                'title' => 'Proyección futura: de zona dormitorio a ciudad planificada',
                'description' => 'Proyección futura: de zona dormitorio a ciudad planificada',
                'content' => "Actualmente, Villa Bonita trabaja en el diseño y ejecución de un mega proyecto urbanístico con el objetivo de transformar el Urubó. La visión ya no es simplemente habitacional.\n\nSe proyecta una ciudad planificada, con altos estándares de infraestructura, espacios públicos de calidad, equipamiento educativo, centros de salud, comercio, servicios y zonas recreativas. La meta es romper con el paradigma de \"zona dormitorio\" y consolidar un núcleo urbano autosuficiente, moderno y con identidad propia. Villa Bonita se posiciona así como un modelo de desarrollo integral",
                'banner1' => null,
                'banner2' => null,
                'banner3' => null,
                'created_at' => Carbon::parse('2025-09-10 20:36:13'),
                'updated_at' => Carbon::parse('2025-09-10 20:36:13'),
            ],
        ]);
    }
}
