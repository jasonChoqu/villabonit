import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import variables from "@/core/config/variables";
import { useDispatch } from "react-redux";
import { getMe } from "@/core/reducer/auth.reducer";
import type { AppDispatch } from "@/store";
import AppLayoutAdmin from "@/components/layout/AppLayoutAdmin";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import AppLayoutWeb from "@/components/layout/AppLayoutWeb";

import SignIn from "@/pages/AuthPages/SignIn";
import NotFound from "@/pages/OtherPage/NotFound";
import Unauthorized from "@/pages/OtherPage/Unauthorized";
import HomePage from "@/pages/WebPage/HomePage";
import ContactPage from "@/pages/WebPage/ContactPage";
import EventsPage from "@/pages/WebPage/EventsPage";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";

import HomeAdmin from "@/pages/admin/home/Home";
import UserPage from "@/pages/admin/users/Main";
import UserShowPage from "@/pages/admin/users/Show";
import RolPage from "@/pages/admin/roles/Main";
import RolPermissionPage from "@/pages/admin/roles/permissions/Main";
import PermissionPage from "@/pages/admin/permissions/Main";
import AnnouncementPage from "@/pages/admin/announcements/Main";
import EventTypePage from "@/pages/admin/event-types/Main";
import EventPage from "@/pages/admin/events/Main";
import CoursePage from "@/pages/admin/courses/Main";
import PaymentPage from "@/pages/admin/monthlypay/Main";
import PaymentReport from "@/pages/admin/monthlypay/Report";
import HistoryAdminPage from "@/pages/admin/histories/Main";
import ContactAdminPage from "@/pages/admin/contacts/Main";
import BeginningPage from "@/pages/admin/beginnings/Main";
import MoralValuePage from "@/pages/admin/moral-values/Main";
import DirectivityAdminPage from "@/pages/admin/directivities/Main";
import RequirementAdminPage from "@/pages/admin/requirements/Main";
import AgreementAdminPage from "@/pages/admin/agreements/Main";
import NewsletterPage from "@/pages/admin/newsletters/Main";
import FaqPage from "@/pages/admin/faqs/Main";
import BannerPage from "@/pages/admin/banners/Main";
import SocialNetworkPage from "@/pages/admin/social-networks/Main";

import Historypage from "@/pages/WebPage/Historypage";
import Directivapage from "@/pages/WebPage/DirectivePage";
import Requisitospage from "@/pages/WebPage/RequirementsPage";
import Estatutospage from "@/pages/WebPage/StatutesPage";
import Visionpage from "@/pages/WebPage/Visionpage";
import Coursespage from "@/pages/WebPage/CoursesPage";
import Conveniospage from "@/pages/WebPage/AgreementsPage";
import Renovationpage from "@/pages/WebPage/RenovationPage";
import Visadopage from "@/pages/WebPage/Visadopage";
import Certificacionespage from "@/pages/WebPage/CertificationsPage";
import Formulariopage from "@/pages/WebPage/FormPage";
import AffiliatesPage from "@/pages/WebPage/AffiliatesPage";
import ResourceBeginPage from "@/pages/admin/resourcebegin/Main";

import UserProfiles from "@/pages/admin/UserProfiles";

import LoaderScreen from "@/components/common/LoaderScreen";
import { ToastContainer } from "react-toastify";
import ProjectsPage from "@/pages/WebPage/Projects";
import Servicepage from "@/pages/WebPage/Services";
import ClientsList from "@/pages/admin/clients/Main";
import GalleryList from "@/pages/admin/gallery/Main";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(variables.session.tokenName);
    if (token) {
      dispatch(getMe()).finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch]);

  if (checkingAuth) {
    return <LoaderScreen />;
  }

  return (
    <>
      <Router>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          {/* Web Layout */}
          <Route element={<AppLayoutWeb />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/cursos" element={<Coursespage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/historia" element={<Historypage />} />
            <Route path="/mision" element={<Visionpage />} />
            <Route path="/convenios" element={<Conveniospage />} />
            <Route path="/directiva" element={<Directivapage />} />
            <Route path="/estatutos" element={<Estatutospage />} />
            <Route path="/requisitos" element={<Requisitospage />} />
            <Route path="/renovacion_datos" element={<Renovationpage />} />
            <Route path="/visado_planos" element={<Visadopage />} />
            <Route path="/afiliados" element={<AffiliatesPage />} />
            <Route path="/certificacion_trabajo" element={<Certificacionespage />} />
            <Route path="/formulario_solicitud" element={<Formulariopage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/services" element={<Servicepage />} />
          </Route>

          {/* Dashboard Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayoutAdmin />}>
              <Route path="/admin" element={<HomeAdmin />} />
              <Route path="/admin/perfil" element={<UserProfiles />} />
              <Route path="/admin/usuarios" element={<UserPage />} />
              <Route path="/admin/usuarios/:id" element={<UserShowPage />} />
              <Route path="/admin/roles" element={<RolPage />} />
              <Route path="/admin/roles/:id/permisos" element={<RolPermissionPage />} />
              <Route path="/admin/permisos" element={<PermissionPage />} />
              <Route path="/admin/comunicados" element={<AnnouncementPage />} />
              <Route path="/admin/tipo_eventos" element={<EventTypePage />} />
              <Route path="/admin/eventos" element={<EventPage />} />
              <Route path="/admin/cursos" element={<CoursePage />} />
              <Route path="/admin/montlypay" element={<PaymentPage />} />
              <Route path="/admin/montlypayreport" element={<PaymentReport />} />
              <Route path="/admin/historias" element={<HistoryAdminPage />} />
              <Route path="/admin/contactos" element={<ContactAdminPage />} />
              <Route path="/admin/principios" element={<BeginningPage />} />
              <Route path="/admin/valores_morales" element={<MoralValuePage />} />
              <Route path="/admin/directiva" element={<DirectivityAdminPage />} />
              <Route path="/admin/requisitos" element={<RequirementAdminPage />} />
              <Route path="/admin/acuerdos" element={<AgreementAdminPage />} />
              <Route path="/admin/consultas" element={<NewsletterPage />} />
              <Route path="/admin/preguntas_frecuentes" element={<FaqPage />} />
              <Route path="/admin/banners" element={<BannerPage />} />
              <Route path="/admin/redes_sociales" element={<SocialNetworkPage />} />
              <Route path="/admin/certificaciones" element={<SocialNetworkPage />} />
              <Route path="/admin/resourcebegin" element={<ResourceBeginPage />} />
              <Route path="/admin/clientes" element={<ClientsList />} />
              <Route path="/admin/gallery" element={<GalleryList />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<SignIn />} />
          </Route>

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
