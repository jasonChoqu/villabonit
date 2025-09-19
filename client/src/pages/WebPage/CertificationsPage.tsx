import {
  BadgeCheck,
} from "lucide-react";

const certificaciones = [
  {
    icon: <BadgeCheck size={42} className="text-green-600" />,
    titulo: "Afiliación",
    descripcion: "Confirma tu registro como miembro activo del Colegio con validez nacional.",
  },
  // ...otros objetos...
];

const CertificacionesPage = () => (
  <div>
    <h1>Certificaciones Oficiales</h1>
    <div>
      {certificaciones.map((item, idx) => (
        <div key={idx}>
          {item.icon}
          <div>{item.titulo}</div>
          <div>{item.descripcion}</div>
        </div>
      ))}
    </div>
  </div>
);

export default CertificacionesPage;