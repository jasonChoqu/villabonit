import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { VideoContentService as ItemService } from "@/core/services/video/video-content.service";
import type { IVideoContent as IItemResource } from "@/core/types/IVideoContent";
import { Search, Plus, Trash2, Edit, Play, Eye } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import DataTable from "@/components/table/DataTable";

const columns = [
  {
    key: "id",
    header: "ID",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div className="font-bold">{item.id}</div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "title",
    header: "Título",
    render: (item: IItemResource) => (
      <div className="font-bold text-gray-900">{item.title}</div>
    ),
    sortable: true,
  },
  {
    key: "description",
    header: "Descripción",
    render: (item: IItemResource) => (
      <div className="text-gray-600 max-w-xs truncate" title={item.description}>
        {item.description}
      </div>
    ),
    sortable: false,
  },
  {
    key: "video_preview",
    header: "Preview",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-2">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-16 h-12 object-cover rounded border"
          />
        ) : (
          <div className="w-16 h-12 bg-gray-200 rounded border flex items-center justify-center">
            <Play className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    ),
    sortable: false,
  },
  {
    key: "video_url",
    header: "URL del Video",
    render: (item: IItemResource) => (
      <div className="max-w-xs">
        <a
          href={item.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm truncate block"
          title={item.video_url}
        >
          {item.video_url}
        </a>
      </div>
    ),
    sortable: false,
  },
  {
    key: "is_active",
    header: "Estado",
    render: (item: IItemResource) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          item.is_active
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {item.is_active ? "Activo" : "Inactivo"}
      </span>
    ),
    sortable: true,
  },
  {
    key: "order",
    header: "Orden",
    render: (item: IItemResource) => (
      <div className="font-medium text-center">{item.order}</div>
    ),
    sortable: true,
  },
];

export default function VideoContentList() {
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
    defaultSort: { key: "order", direction: "asc" },
    defaultPerPage: 10,
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

  const openDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "primary" | "danger" = "primary"
  ) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      "Confirmar eliminación",
      `¿Estás seguro que deseas eliminar el video "${item.title}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      setIsProcessing(true);
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Video eliminado");
      fetchItems();
    } catch (error: any) {
      console.error("Error al eliminar video:", error);
      toastify.error(error?.response?.data?.message || "Error al eliminar video");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handlePreview = (item: IItemResource) => {
    if (item.video_url) {
      window.open(item.video_url, '_blank');
    }
  };

  const actions = [
    {
      label: "Ver Video",
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: IItemResource) => handlePreview(item),
      variant: "secondary" as const,
      show: (item: IItemResource) => !!item.video_url,
    },
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
        <button
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Agregar Video
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar videos..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Video Content" />
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
      <Form
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
        initialData={currentItem}
        load={fetchItems}
      />
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