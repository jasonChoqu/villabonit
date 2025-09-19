import { InputField } from "@/components/form-field";
import Modal from "@/components/modal/Modal";
import { FormProviderWrapper } from "@/composables/FormProviderWrapper";
import type {
  IClientCreateRequest as ICreateRequest,
  IClientUpdateRequest as IUpdateRequest,
  IClient as IItemResponse,
} from "@/core/types/IClients";
import { ClientService as ItemService } from "@/core/services/clients/client.service";
import { toastify } from "@/core/utils/toastify";
// import useAuth from "@/core/hooks/useAuth";
import { storeSchema, updateSchema } from "./validation";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const ClientModal = ({ isOpen, onClose, initialData = null, load }: ClientModalProps) => {
  //const { user } = useAuth();
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
      }
    : {
        name: "",
        email: "",
        phone: "",
        address: "",
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value != null));
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || "Item actualizado");
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));
    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || "Item creado");
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response.data.message));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Cliente" : "Nuevo Cliente"} size="lg">
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? "edit" : "create"}
        className="w-full"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <InputField name="name" label="Nombre" placeholder="Ej: Nombre del cliente..." />
          </div>
          <div className="col-span-1">
            <InputField name="phone" label="Celular" placeholder="Ej: 75757575" />
          </div>
          <div className="col-span-1">
            <InputField name="email" label="Email" placeholder="Ej: example@gmail.com" />
          </div>

          <div className="col-span-2">
            <InputField name="address" label="Dirección" placeholder="Ej: Av. Blanco Galindo..." />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ClientModal;
