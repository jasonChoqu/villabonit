import PageBreadcrumb from "@/components/common/PageBreadCrumb";
//import PageMeta from "../components/common/PageMeta";

export default function Blank() {
  return (
    <div>
      {/* <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Bienvenido
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Comience a colocar contenido en cuadrículas o paneles, también puede usar diferentes combinaciones de cuadrículas. Consulte el panel de control y otras páginas.
          </p>
        </div>
      </div>
    </div>
  );
}
