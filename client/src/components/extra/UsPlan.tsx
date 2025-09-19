import UsPlanCard from "./UsPlanCard";

export default function UsPlan() {
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
        highlights={[
          { label: "CEO:", value: "Willmar Guzmán Justiniano" },
          { label: "CFO:", value: "Carlos Guzmán Justiniano" }
        ]}
      />
    </div>
  );
}