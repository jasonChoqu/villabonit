import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toastify } from '@/core/utils/toastify';
import { ValuePropositionService } from '@/core/services/value-proposition/value-proposition.service';

interface ValueProposition {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ValuePropositionFormData {
  title: string;
  description: string;
}

interface ValuePropositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  valueProposition?: ValueProposition | null;
  mode: 'create' | 'edit' | 'view';
}

const ValuePropositionModal: React.FC<ValuePropositionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  valueProposition,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValuePropositionFormData>();

  useEffect(() => {
    if (isOpen && valueProposition) {
      reset({
        title: valueProposition.title,
        description: valueProposition.description,
      });
    } else if (isOpen && mode === 'create') {
      reset({
        title: '',
        description: '',
      });
    }
  }, [isOpen, valueProposition, mode, reset]);

  const onSubmit = async (data: ValuePropositionFormData) => {
    if (mode === 'view') return;

    setLoading(true);
    
    try {
      if (mode === 'create') {
        await ValuePropositionService.store(data);
        toastify.success('Propuesta de valor creada correctamente');
      } else if (mode === 'edit' && valueProposition) {
        await ValuePropositionService.update(valueProposition.id, data);
        toastify.success('Propuesta de valor actualizada correctamente');
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving value proposition:', error);
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach((message: any) => {
          toastify.error(message);
        });
      } else {
        toastify.error('Error al guardar la propuesta de valor');
      }
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Nueva Propuesta de Valor';
      case 'edit':
        return 'Editar Propuesta de Valor';
      case 'view':
        return 'Ver Propuesta de Valor';
      default:
        return '';
    }
  };

  const isReadOnly = mode === 'view';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', {
                  required: 'El título es obligatorio',
                  minLength: {
                    value: 3,
                    message: 'El título debe tener al menos 3 caracteres',
                  },
                  maxLength: {
                    value: 255,
                    message: 'El título no puede exceder 255 caracteres',
                  },
                })}
                readOnly={isReadOnly}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                placeholder="Ingresa el título de la propuesta de valor"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description', {
                  required: 'La descripción es obligatoria',
                  minLength: {
                    value: 10,
                    message: 'La descripción debe tener al menos 10 caracteres',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'La descripción no puede exceder 1000 caracteres',
                  },
                })}
                readOnly={isReadOnly}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                placeholder="Describe la propuesta de valor..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Metadata for view mode */}
            {mode === 'view' && valueProposition && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(valueProposition.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Última Actualización
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(valueProposition.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {mode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              
              {!isReadOnly && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {mode === 'create' ? 'Crear' : 'Actualizar'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionModal;