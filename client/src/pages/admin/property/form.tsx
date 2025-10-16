import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Modal from "@/components/modal/Modal";
import { InputField, SelectField } from "@/components/form-field";
import { PropertyService } from "@/core/services/properties/property.service";
import { type IProperty, AMENITIES_OPTIONS } from "@/core/types/IProperties";
import { toastify } from "@/core/utils/toastify";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IProperty | null;
  load: () => void;
}

const PROPERTY_TYPE_OPTIONS = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Casa Adosada' },
  { value: 'duplex', label: 'Dúplex' },
  { value: 'triplex', label: 'Tríplex' },
  { value: 'studio', label: 'Estudio' },
  { value: 'loft', label: 'Loft' },
  { value: 'villa', label: 'Villa' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'cottage', label: 'Cabaña' },
  { value: 'farmhouse', label: 'Casa de Campo' },
  { value: 'condo', label: 'Condominio' },
  { value: 'cabins', label: 'Cabañas' },
  { value: 'ranch', label: 'Rancho' },
  { value: 'chalet', label: 'Chalet' },
  { value: 'mansion', label: 'Mansión' },
  { value: 'retirement_home', label: 'Casa de Retiro' },
  { value: 'studio_apartment', label: 'Apartamento Estudio' },
  { value: 'garden_house', label: 'Casa con Jardín' },
  { value: 'attic', label: 'Ático' },
  { value: 'basement_flat', label: 'Apartamento Sótano' },
  { value: 'mixed_use', label: 'Uso Mixto' },
  { value: 'mobile_home', label: 'Casa Móvil' },
  { value: 'tiny_house', label: 'Casa Pequeña' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'other', label: 'Otro' },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendida' },
  { value: 'reserved', label: 'Reservada' },
  { value: 'rented', label: 'Alquilada' },
  { value: 'off_market', label: 'Fuera del Mercado' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'COP', label: 'COP ($)' },
  { value: 'MXN', label: 'MXN ($)' },
  { value: 'BOB', label: 'Bs (Bolivianos)' },
];

const BOLIVIA_CITIES = [
  { value: 'cochabamba', label: 'Cochabamba' },
  { value: 'la_paz', label: 'La Paz' },
  { value: 'santa_cruz', label: 'Santa Cruz de la Sierra' },
  { value: 'sucre', label: 'Sucre' },
  { value: 'oruro', label: 'Oruro' },
  { value: 'potosi', label: 'Potosí' },
  { value: 'tarija', label: 'Tarija' },
  { value: 'trinidad', label: 'Trinidad' },
  { value: 'cobija', label: 'Cobija' },
  { value: 'quillacollo', label: 'Quillacollo' },
  { value: 'sacaba', label: 'Sacaba' },
  { value: 'tiquipaya', label: 'Tiquipaya' },
  { value: 'colcapirhua', label: 'Colcapirhua' },
  { value: 'el_alto', label: 'El Alto' },
  { value: 'montero', label: 'Montero' },
  { value: 'warnes', label: 'Warnes' },
];

const BOLIVIA_DEPARTMENTS = [
  { value: 'cercado', label: 'Cercado' },
  { value: 'chapare', label: 'Chapare' },
  { value: 'quillacollo', label: 'Quillacollo' },
  { value: 'tapacare', label: 'Tapacarí' },
  { value: 'arque', label: 'Arque' },
  { value: 'capinota', label: 'Capinota' },
  { value: 'bolivar', label: 'Bolívar' },
  { value: 'tiraque', label: 'Tiraque' },
  { value: 'carrasco', label: 'Carrasco' },
  { value: 'mizque', label: 'Mizque' },
  { value: 'punata', label: 'Punata' },
  { value: 'ayopaya', label: 'Ayopaya' },
  { value: 'esteban_arce', label: 'Esteban Arce' },
  { value: 'campero', label: 'Campero' },
  { value: 'arani', label: 'Arani' },
  { value: 'murillo', label: 'Murillo' },
  { value: 'omasuyos', label: 'Omasuyos' },
  { value: 'pacajes', label: 'Pacajes' },
  { value: 'caranavi', label: 'Caranavi' },
  { value: 'nor_yungas', label: 'Nor Yungas' },
  { value: 'sud_yungas', label: 'Sud Yungas' },
  { value: 'inquisivi', label: 'Inquisivi' },
  { value: 'loayza', label: 'Loayza' },
  { value: 'los_andes', label: 'Los Andes' },
  { value: 'ingavi', label: 'Ingavi' },
  { value: 'warnes', label: 'Warnes' },
  { value: 'sara', label: 'Sara' },
  { value: 'ichilo', label: 'Ichilo' },
  { value: 'cordillera', label: 'Cordillera' },
  { value: 'vallegrande', label: 'Vallegrande' },
  { value: 'florida', label: 'Florida' },
  { value: 'caballero', label: 'Caballero' },
  { value: 'santistevan', label: 'Santiestevan' },
  { value: 'chiquitos', label: 'Chiquitos' },
  { value: 'velasco', label: 'Velasco' },
  { value: 'nuflo_de_chavez', label: 'Ñuflo de Chávez' },
  { value: 'guarayos', label: 'Guarayos' },
  { value: 'angel_sandoval', label: 'Ángel Sandoval' },
  { value: 'manuel_maria_caballero', label: 'Manuel María Caballero' },
];

const Form: React.FC<FormProps> = ({ isOpen, onClose, initialData, load }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const isEditing = !!initialData;

  const methods = useForm({
    mode: 'onChange'
  });

  const { handleSubmit, watch } = methods;
  
  // Watch all fields that are used in validation
  const watchedFields = watch(['title', 'property_type', 'status', 'price', 'currency', 'agent_name', 'agent_phone']);
  const propertyType = watchedFields[1]; // property_type
  const isTerreno = propertyType === 'terreno';

  const totalSteps = isTerreno ? 4 : 5;

  useEffect(() => {
    if (isOpen && initialData) {
      // Reset form and populate with initial data
      methods.reset(initialData);
      
      // Set amenities separately
      if (initialData.amenities && Array.isArray(initialData.amenities)) {
        setSelectedAmenities(initialData.amenities);
      }
      setCurrentStep(1);
    } else if (isOpen && !initialData) {
      const defaultValues = {
        title: '',
        property_type: 'house',
        status: 'available',
        currency: 'USD',
        price: '',
        is_featured: false,
        bedrooms: '',
        bathrooms: '',
        parking: '',
        area_m2: '',
        built_year: '',
        floor: '',
        total_floors: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        lat: '',
        lng: '',
        agent_name: '',
        agent_phone: '',
        agent_email: '',
        description: ''
      };
      methods.reset(defaultValues);
      setSelectedAmenities([]);
      setCurrentStep(1);
      
      // Force a re-render to ensure form state is properly initialized
      setTimeout(() => {
        methods.trigger();
      }, 100);
    }
  }, [isOpen, initialData, methods]);

  // Effect to handle property type changes and adjust current step
  useEffect(() => {
    if (propertyType) {
      const newTotalSteps = propertyType === 'terreno' ? 4 : 5;
      // If current step is beyond the new total steps, reset to step 1
      if (currentStep > newTotalSteps) {
        setCurrentStep(1);
      }
    }
  }, [propertyType, currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const formData = methods.getValues();
    
    // Debug: log the form data to see what's happening
    console.log('Form data:', formData);
    console.log('Current step:', currentStep);
    console.log('Is terreno:', isTerreno);
    
    switch (currentStep) {
      case 1:
        const step1Valid = !!(formData.title && formData.title.trim() && formData.property_type && formData.status);
        console.log('Step 1 validation:', step1Valid);
        return step1Valid;
      case 2:
        const step2Valid = !!(formData.price && parseFloat(formData.price) > 0 && formData.currency);
        console.log('Step 2 validation:', step2Valid);
        return step2Valid;
      case 3:
        if (isTerreno) {
          // For terreno, step 3 is property details (area) - optional
          return true;
        }
        return true; // For non-terreno properties, step 3 (property details) is optional
      case 4:
        if (isTerreno) {
          const step4TerrenoValid = !!(formData.agent_name && formData.agent_name.trim() && formData.agent_phone && formData.agent_phone.trim());
          console.log('Step 4 terreno validation:', step4TerrenoValid);
          return step4TerrenoValid;
        }
        return true; // Location is optional for non-terreno
      case 5:
        const step5Valid = !!(formData.agent_name && formData.agent_name.trim() && formData.agent_phone && formData.agent_phone.trim());
        console.log('Step 5 validation:', step5Valid);
        return step5Valid;
      default:
        return true;
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!data.title || data.title.trim() === '') {
        toastify.error("El título es obligatorio");
        setIsLoading(false);
        return;
      }
      
      if (!data.price || data.price <= 0) {
        toastify.error("El precio debe ser mayor a 0");
        setIsLoading(false);
        return;
      }

      // Limpiar datos - convertir strings vacíos a null para campos numéricos
      const cleanData = {
        ...data,
        amenities: selectedAmenities,
        // Asegurar que los campos numéricos sean números o null
        price: data.price ? parseFloat(data.price) : null,
        area_m2: data.area_m2 ? parseFloat(data.area_m2) : null,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : null,
        parking: data.parking ? parseInt(data.parking, 10) : null,
        built_year: data.built_year ? parseInt(data.built_year, 10) : null,
        floor: data.floor ? parseInt(data.floor, 10) : null,
        total_floors: data.total_floors ? parseInt(data.total_floors, 10) : null,
        lat: data.lat ? parseFloat(data.lat) : null,
        lng: data.lng ? parseFloat(data.lng) : null,
      };

      // Validar año de construcción si se proporciona
      if (cleanData.built_year) {
        const currentYear = new Date().getFullYear();
        if (cleanData.built_year < 1800 || cleanData.built_year > currentYear + 5) {
          toastify.error(`El año de construcción debe estar entre 1800 y ${currentYear + 5}`);
          setIsLoading(false);
          return;
        }
      }

      if (isEditing && initialData) {
        await PropertyService.update(initialData.id, cleanData);
        toastify.success("Propiedad actualizada exitosamente");
      } else {
        await PropertyService.create(cleanData);
        toastify.success("Propiedad creada exitosamente");
      }

      load();
      onClose();
    } catch (error) {
      console.error("Error saving property:", error);
      toastify.error("Error al guardar la propiedad");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="title"
                label="Título *"
              />

              <SelectField
                name="property_type"
                label="Tipo de Propiedad *"
                options={PROPERTY_TYPE_OPTIONS}
              />

              <SelectField
                name="status"
                label="Estado *"
                options={STATUS_OPTIONS}
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  {...methods.register("is_featured")}
                  className="rounded"
                />
                <label htmlFor="is_featured" className="text-sm">
                  Propiedad Destacada
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                {...methods.register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Información de Precio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Precio *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 150000"
                  {...methods.register("price", {
                    required: "El precio es obligatorio",
                    setValueAs: (value) => value ? parseFloat(value) : 0,
                    validate: (value) => value > 0 || "El precio debe ser mayor a 0"
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <SelectField
                name="currency"
                label="Moneda *"
                options={CURRENCY_OPTIONS}
              />
            </div>
          </div>
        );

      case 3:
        if (isTerreno) {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Detalles del Terreno</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="area_m2" className="block text-sm font-medium mb-1">
                    Área (m²)
                  </label>
                  <input
                    id="area_m2"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 500.00"
                    {...methods.register("area_m2", {
                      setValueAs: (value) => value ? parseFloat(value) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Ubicación del terreno */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Ubicación</h4>
                
                <InputField
                  name="address"
                  label="Dirección"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectField
                    name="city"
                    label="Ciudad"
                    options={BOLIVIA_CITIES}
                  />

                  <SelectField
                    name="state"
                    label="Departamento"
                    options={BOLIVIA_DEPARTMENTS}
                  />

                  <InputField
                    name="zipcode"
                    label="Código Postal"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lat" className="block text-sm font-medium mb-1">
                      Latitud
                    </label>
                    <input
                      id="lat"
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      placeholder="Ej: -17.3935"
                      {...methods.register("lat", {
                        setValueAs: (value) => value ? parseFloat(value) : null
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lng" className="block text-sm font-medium mb-1">
                      Longitud
                    </label>
                    <input
                      id="lng"
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      placeholder="Ej: -66.1570"
                      {...methods.register("lng", {
                        setValueAs: (value) => value ? parseFloat(value) : null
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Detalles de la Propiedad</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="area_m2" className="block text-sm font-medium mb-1">
                    Área (m²)
                  </label>
                  <input
                    id="area_m2"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 120.50"
                    {...methods.register("area_m2", {
                      setValueAs: (value) => value ? parseFloat(value) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium mb-1">
                    Habitaciones
                  </label>
                  <input
                    id="bedrooms"
                    type="number"
                    min="0"
                    placeholder="Ej: 3"
                    {...methods.register("bedrooms", {
                      setValueAs: (value) => value ? parseInt(value, 10) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium mb-1">
                    Baños
                  </label>
                  <input
                    id="bathrooms"
                    type="number"
                    min="0"
                    placeholder="Ej: 2"
                    {...methods.register("bathrooms", {
                      setValueAs: (value) => value ? parseInt(value, 10) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="parking" className="block text-sm font-medium mb-1">
                    Parking
                  </label>
                  <input
                    id="parking"
                    type="number"
                    min="0"
                    placeholder="Ej: 1"
                    {...methods.register("parking", {
                      setValueAs: (value) => value ? parseInt(value, 10) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="built_year" className="block text-sm font-medium mb-1">
                    Año de Construcción
                  </label>
                  <input
                    id="built_year"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear() + 5}
                    placeholder={`Ej: ${new Date().getFullYear()}`}
                    {...methods.register("built_year", {
                      setValueAs: (value) => value ? parseInt(value, 10) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="floor" className="block text-sm font-medium mb-1">
                    Piso
                  </label>
                  <input
                    id="floor"
                    type="number"
                    min="0"
                    placeholder="Ej: 5"
                    {...methods.register("floor", {
                      setValueAs: (value) => value ? parseInt(value, 10) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="total_floors" className="block text-sm font-medium mb-1">
                    Total de Pisos
                  </label>
                  <input
                    id="total_floors"
                    type="number"
                    min="1"
                    placeholder="Ej: 10"
                    {...methods.register("total_floors", {
                      setValueAs: (value) => value ? parseInt(value, 10) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        }

      case 4:
        if (isTerreno) {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Información del Agente</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="agent_name"
                  label="Nombre del Agente *"
                />

                <InputField
                  name="agent_phone"
                  label="Teléfono del Agente *"
                />

                <InputField
                  name="agent_email"
                  label="Email del Agente"
                  type="email"
                />
              </div>

              {/* Amenidades para terreno */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Amenidades</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {AMENITIES_OPTIONS.map((amenity: string) => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Ubicación</h3>
              
              <InputField
                name="address"
                label="Dirección"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="city"
                  label="Ciudad"
                />

                <InputField
                  name="state"
                  label="Estado/Departamento"
                />

                <InputField
                  name="zipcode"
                  label="Código Postal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-sm font-medium mb-1">
                    Latitud
                  </label>
                  <input
                    id="lat"
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="Ej: -12.046374"
                    {...methods.register("lat", {
                      setValueAs: (value) => value ? parseFloat(value) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="lng" className="block text-sm font-medium mb-1">
                    Longitud
                  </label>
                  <input
                    id="lng"
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="Ej: -77.042793"
                    {...methods.register("lng", {
                      setValueAs: (value) => value ? parseFloat(value) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        }

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Información del Agente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                name="agent_name"
                label="Nombre del Agente *"
              />

              <InputField
                name="agent_phone"
                label="Teléfono del Agente *"
              />

              <InputField
                name="agent_email"
                label="Email del Agente"
                type="email"
              />
            </div>

            {/* Amenidades */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Amenidades</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {AMENITIES_OPTIONS.map((amenity: string) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Editar Propiedad" : "Crear Propiedad"}
      size="lg"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div key={index + 1} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= index + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between space-x-4 pt-4 border-t">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed() || isLoading}
                    className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${
                      !canProceed() || isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !canProceed()}
                    className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${
                      isLoading || !canProceed()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default Form;