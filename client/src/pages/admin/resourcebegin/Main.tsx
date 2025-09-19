import React, { useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ResourceBeginService as ItemService } from "@/core/services/resource-begin/resource-begin.service";
import type { IResourceBegin as IItemResource } from "@/core/types/IResourceBegin";
import { Search, Plus, Trash2, Edit, Image as ImageIcon, Link as LinkIcon, FileText, PlayCircle } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";
import Modal from "@/components/modal/Modal";
import type { ITableColumn } from "@/core/types/ITable"; // 👈 usa el tipo que consume tu DataTable

// ===== Helpers =====
const truncate = (s?: string | null, n = 120) => (!s ? "-" : s.length > n ? s.slice(0, n) + "…" : s);

const toAbsoluteUrl = (u?: string | null) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${window.location.origin}${u}`;
  return `${window.location.origin}/${u}`;
};

const getExt = (u?: string | null) => {
  if (!u) return "";
  const clean = u.split("?")[0].split("#")[0];
  const idx = clean.lastIndexOf(".");
  return idx >= 0 ? clean.substring(idx + 1).toLowerCase() : "";
};

const isImageExt = (ext: string) => ["jpg","jpeg","png","gif","webp","bmp","svg","avif"].includes(ext);
const isVideoExt = (ext: string) => ["mp4","webm","mov","m4v","mkv","avi"].includes(ext);

const isImage = (url?: string | null, mime?: string) => {
  const ext = getExt(url);
  if (mime) return mime.startsWith("image/");
  return isImageExt(ext);
};
const isVideo = (url?: string | null, mime?: string) => {
  const ext = getExt(url);
  if (mime) return mime.startsWith("video/");
  return isVideoExt(ext);
};

const TypeBadge: React.FC<{ type: "img" | "video" | "unknown" }> = ({ type }) => (
  <span className={`px-2 py-0.5 text-[11px] rounded-full border ${
    type === "img" ? "bg-green-50 text-green-700 border-green-200" :
    type === "video" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
    "bg-gray-50 text-gray-700 border-gray-200"
  }`}>
    {type === "img" ? "IMG" : type === "video" ? "VIDEO" : "FILE"}
  </span>
);

// ===== Componente =====
export default function ResourceBeginList() {
  const {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  } = useResource({
    service: ItemService,
    defaultSort: { key: "id", direction: "asc" },
    defaultPerPage: 5,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  // Visor de media
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"img" | "video" | "unknown">("unknown");

  const { hasPermission: _ } = useAuth();

  const openDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "primary" | "danger" = "primary"
  ) => setDialogConfig({ isOpen: true, title, message, onConfirm, variant });

  const closeDialog = () => setDialogConfig(null);

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog("Confirmar eliminación", "¿Deseas eliminar este recurso inicial?", () => handleDelete(item), "danger");
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      setIsProcessing(true);
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Item eliminado");
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toastify.error("No se pudo eliminar el registro");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handleOpenPreview = (u?: string | null) => {
    if (!u) return;
    const abs = toAbsoluteUrl(u);
    const type: "img" | "video" | "unknown" = isImage(u) ? "img" : isVideo(u) ? "video" : "unknown";
    setPreviewUrl(abs);
    setPreviewType(type);
  };

  // ===== Columnas (tipadas según tu DataTable) =====
  const columns: ITableColumn<IItemResource>[] = useMemo(() => ([
    {
      key: "id",
      header: "ID",
      sortable: true,
      render: (item) => <span>{item.id}</span>,
    },
    {
      key: "url",
      header: "Contenido",
      sortable: false,
      render: (item) => {
        if (!item.url) return <span>-</span>;

        const abs = toAbsoluteUrl(item.url);
        const type: "img" | "video" | "unknown" = isImage(item.url) ? "img" : isVideo(item.url) ? "video" : "unknown";

        return (
          <div className="flex items-center gap-3">
            {type === "img" ? (
              <button
                className="border rounded-md overflow-hidden w-16 h-16 bg-gray-50 hover:ring-2 hover:ring-gray-300"
                onClick={() => handleOpenPreview(item.url)}
                title="Ver imagen"
              >
                <img
                  src={abs}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
              </button>
            ) : type === "video" ? (
              <button
                className="relative border rounded-md overflow-hidden w-24 h-16 bg-black hover:ring-2 hover:ring-gray-300"
                onClick={() => handleOpenPreview(item.url)}
                title="Reproducir video"
              >
                <video src={abs} muted className="w-full h-full object-cover pointer-events-none" />
                <PlayCircle className="absolute inset-0 m-auto w-8 h-8 text-white/90 drop-shadow" />
              </button>
            ) : (
              <span className="text-gray-500">—</span>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={abs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 underline"
                  title={abs}
                >
                  <LinkIcon className="w-4 h-4" />
                  {truncate(item.url, 38)}
                </a>
                <TypeBadge type={type} />
              </div>
              <div className="text-xs text-gray-500">
                {getExt(item.url) ? `.${getExt(item.url)}` : "sin extensión"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "text",
      header: "Texto",
      sortable: false,
      render: (item) => (
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 mt-0.5 text-gray-500" />
          <span title={item.text ?? ""}>{truncate(item.text, 100)}</span>
        </div>
      ),
    },
    {
      key: "logo_url",
      header: "Logo",
      sortable: false,
      render: (item) =>
        item.logo_url ? (
          <a
            href={toAbsoluteUrl(item.logo_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
            title={item.logo_url ?? ""}
          >
            <img
              src={toAbsoluteUrl(item.logo_url)}
              alt="logo"
              className="h-8 w-8 rounded-md object-contain border border-gray-200"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            />
            <span className="text-gray-600 underline">{truncate(item.logo_url, 36)}</span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-gray-500">
            <ImageIcon className="w-4 h-4" /> <span>-</span>
          </span>
        ),
    },
  ]), []);

  const actions = [
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: (item: IItemResource) => !!item.id,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: IItemResource) => !!item.id,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {items.length === 0 && (
          <button
            className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>
        )}
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Recurso inicial" />
      <DataTable
        data={items as IItemResource[]}
        columns={columns}
        actions={actions}
        sort={sort}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        availableLimits={[5, 10, 20, 50]}
        loading={loading}
        renderTopToolbar={renderToolbar}
      />

      {/* Form modal */}
      <Form
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
        initialData={currentItem}
        load={fetchItems}
      />

      {/* Preview modal */}
      <Modal
        isOpen={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        title={previewType === "img" ? "Vista previa" : previewType === "video" ? "Reproducir video" : "Archivo"}
        size="xl"
      >
        <div className="w-full">
          {previewType === "img" && previewUrl && (
            <img src={previewUrl} alt="preview" className="w-full max-h-[70vh] object-contain rounded-lg" />
          )}
          {previewType === "video" && previewUrl && (
            <video src={previewUrl} controls className="w-full max-h-[70vh] rounded-lg bg-black" />
          )}
          {previewType === "unknown" && previewUrl && (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Abrir archivo
            </a>
          )}
        </div>
      </Modal>

      {dialogConfig && (
        <ConfirmDialog
          isOpen={dialogConfig.isOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          onConfirm={dialogConfig.onConfirm}
          onCancel={closeDialog}
          isProcessing={isProcessing}
          variant={dialogConfig.variant}
          confirmText={dialogConfig.variant === "danger" ? "Eliminar" : "Confirmar"}
        />
      )}
    </div>
  );
}
