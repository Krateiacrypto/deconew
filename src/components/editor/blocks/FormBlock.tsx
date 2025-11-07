import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Block, FormField } from '../../../types/editor';

interface FormBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const FormBlock: React.FC<FormBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const formFields = block.content.formFields || [];

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `Yeni ${type} alanı`,
      placeholder: '',
      required: false
    };

    onContentChange({ formFields: [...formFields, newField] });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = formFields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onContentChange({ formFields: updatedFields });
  };

  const removeField = (fieldId: string) => {
    const updatedFields = formFields.filter(field => field.id !== fieldId);
    onContentChange({ formFields: updatedFields });
  };

  const style: React.CSSProperties = {
    padding: block.style.padding || '2rem',
    margin: block.style.margin,
    backgroundColor: block.style.backgroundColor || '#ffffff',
    borderRadius: block.style.borderRadius || '0.5rem',
    border: block.style.border || '1px solid #e5e7eb',
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    width: block.style.width || '100%',
    maxWidth: '600px'
  };

  const renderField = (field: FormField) => {
    const fieldStyle = {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem'
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            required={field.required}
            style={fieldStyle}
            rows={4}
            disabled={!isPreview}
          />
        );
      case 'select':
        return (
          <select style={fieldStyle} required={field.required} disabled={!isPreview}>
            <option value="">Seçiniz...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              required={field.required}
              disabled={!isPreview}
              className="w-4 h-4 text-emerald-600"
            />
            <span>{field.label}</span>
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            style={fieldStyle}
            disabled={!isPreview}
          />
        );
    }
  };

  return (
    <div style={style}>
      <form onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {block.content.text || 'İletişim Formu'}
        </h3>
        
        <div className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id} className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {!isPreview && isEditing && (
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeField(field.id)}
                    className="w-6 h-6 bg-red-600 text-white rounded-full text-xs hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          className="mt-6 w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          disabled={!isPreview}
        >
          Gönder
        </button>
      </form>

      {!isPreview && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-3"
          >
            {isEditing ? 'Düzenlemeyi Bitir' : 'Formu Düzenle'}
          </button>
          
          {isEditing && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Alan ekle:</p>
              <div className="flex flex-wrap gap-2">
                {['text', 'email', 'textarea', 'select', 'checkbox'].map(type => (
                  <button
                    key={type}
                    onClick={() => addField(type as FormField['type'])}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    {type === 'text' ? 'Metin' :
                     type === 'email' ? 'E-posta' :
                     type === 'textarea' ? 'Uzun Metin' :
                     type === 'select' ? 'Seçim' : 'Onay Kutusu'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};