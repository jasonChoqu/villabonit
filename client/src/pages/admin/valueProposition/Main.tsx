import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ValuePropositionService as ItemService } from "@/core/services/value-proposition/value-proposition.service";
import type { IValuePropositionResponse as IItemResource } from "@/core/types/IValueProposition";
import { Search, Plus, Trash2, Edit, EyeIcon } from "lucide-react";
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
        <div>
          <div className="font-bold">{item.id}</div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "title",
    header: "Título",
    render: (item: IItemResource) => (
      <div className="font-bold">{item.title}</div>
    ),
    sortable: true,
  },
  {
    key: "description",
    header: "Descripción",
    render: (item: IItemResource) => (
      <div className="text-gray-600">
        {item.description.length > 100
          ? `${item.description.substring(0, 100)}...`
          : item.description}
      </div>
    ),
    sortable: false,
  },
  {
    key: "status",
    header: "Estado",
    render: (item: IItemResource) => (
      <span className="badge badge-success">
        Activo
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Fecha de creación",
    render: (item: IItemResource) => (
      <div className="text-gray-600">
        {new Date(item.created_at).toLocaleDateString()}
      </div>
    ),
    sortable: true,
  },
];

export default function ValuePropositionList() {
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
    initialFilters: {},
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

  const handleView = (item: IItemResource) => {
    // Aquí podrías navegear a una página de detalle o abrir un modal de vista
    console.log("Ver propuesta de valor:", item);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      "Confirmar eliminación",
      `¿Estás seguro que deseas eliminar la propuesta de valor "${item.title}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Propuesta de valor eliminada");
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar propuesta de valor:", error);
      toastify.error("Error al eliminar la propuesta de valor");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Ver detalle",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleView(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true,
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
          Agregar
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar propuestas de valor..."
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        /> 
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Propuestas de Valor" />
      <DataTable
        data={items as IItemResource[]}
        columns={columns}
        actions={actions}
        filters={[]}
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