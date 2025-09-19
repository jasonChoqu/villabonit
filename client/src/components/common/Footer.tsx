import { Link } from 'react-router';
import { Home, Phone, Mail, Loader2 } from 'lucide-react';
import logo from "@/assets/images/logo-blanco.svg";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import React, { useEffect, useState, useMemo } from 'react';

import type { ISocialNetwork } from '@/core/types/ISocialNetwork';
import type { IContact } from '@/core/types/IContact';
import { createApiService } from '@/core/services/api.service';

const Footer: React.FC = () => {
  // ---- State ----
  const [socialNetworks, setSocialNetworks] = useState<ISocialNetwork[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Services ----
  const SocialNetworkService = useMemo(() => createApiService({ basePath: 'social_networks' }), []);
  const ContactService      = useMemo(() => createApiService({ basePath: 'contacts' }), []);

  // ---- Fetch ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [socialRes, contactRes] = await Promise.all([
          SocialNetworkService.get('all'),
          ContactService.get('all'),
        ]);
        setSocialNetworks(socialRes?.data ?? []);
        setContacts(contactRes?.data ?? []);
      } catch (e) {
        console.error(e);
        setError('Error al cargar los datos del footer');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [SocialNetworkService, ContactService]);

  // ---- Helpers ----
  const mainContact = contacts?.[0] ?? ({} as Partial<IContact>);
  const mainSocial  = socialNetworks?.[0] ?? ({} as Partial<ISocialNetwork>);

  const socialLinks: Array<{label: string; url?: string; icon: React.ReactElement}> = [
    { label: 'Facebook',  url: (mainSocial as any)?.url_facebook,  icon: <FaFacebook /> },
    { label: 'Instagram', url: (mainSocial as any)?.url_instagram, icon: <FaInstagram /> },
    { label: 'TikTok',    url: (mainSocial as any)?.url_tiktok,    icon: <FaTiktok /> },
    { label: 'YouTube',   url: (mainSocial as any)?.url_youtube,   icon: <FaYoutube /> },
    { label: 'Twitter',   url: (mainSocial as any)?.url_twitter,   icon: <FaTwitter /> },
    { label: 'LinkedIn',  url: (mainSocial as any)?.url_linkedin,  icon: <FaLinkedin /> },
  ].filter(item => !!item.url);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#161515] text-white">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-[#161515] text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <footer className="footer p-10 bg-[#161515] text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Columna izquierda: menú y logo */}
        <div className="flex-1">
          <div className="space-y-6 font-bold text-xl">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-white hover:text-yellow-300 transition-colors text-3xl font-medium">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-white hover:text-yellow-300 transition-colors text-3xl font-medium">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="text-white hover:text-yellow-300 transition-colors text-3xl font-medium">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-white hover:text-yellow-300 transition-colors text-3xl font-medium">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-white hover:text-yellow-300 transition-colors text-3xl font-medium">
                  Contáctanos
                </Link>
              </li>
              <li className="mt-1">
                <img
                  src={logo}
                  alt="Villa Bonita Logo"
                  className="h-20 object-contain"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Columna derecha: datos desde API + redes */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div>
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">Our Company</h3>

            <div className="space-y-4">
              {mainContact?.address && (
                <div className="flex items-start gap-4">
                  <Home className="text-yellow-300 mt-1 flex-shrink-0" size={24} />
                  <span className="text-white text-lg">{mainContact.address}</span>
                </div>
              )}

              {mainContact?.email && (
                <div className="flex items-center gap-4">
                  <Mail className="text-yellow-300 flex-shrink-0" size={24} />
                  <span className="text-white text-lg">{mainContact.email}</span>
                </div>
              )}

              {/* Muestra mobile_number si existe; si no, phone_number */}
              {(mainContact as any)?.mobile_number || mainContact?.phone_number ? (
                <div className="flex items-center gap-4">
                  <Phone className="text-yellow-300 flex-shrink-0" size={24} />
                  <span className="text-white text-lg">
                    {(mainContact as any)?.mobile_number ?? mainContact?.phone_number}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Redes sociales desde API */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center md:justify-start gap-6 mt-8">
              {socialLinks.map((item, idx) => (
                <a
                  key={`${item.label}-${idx}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="flex h-14 w-14 items-center justify-center
                             text-[#161515] bg-yellow-300
                             border-4 border-[#161515] rounded-full
                             hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-300/50
                             transition-all duration-300 focus-visible:outline-none
                             focus-visible:ring-2 focus-visible:ring-yellow-300/70"
                >
                  {React.createElement(item.icon.type, { size: 24 })}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
