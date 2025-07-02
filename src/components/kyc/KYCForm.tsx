import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  MapPin, 
  Upload, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useKYCStore } from '../../store/kycStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const KYCForm: React.FC = () => {
  const { user } = useAuthStore();
  const { submitKYCApplication, uploadDocument, isLoading } = useKYCStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: 'Turkish',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Turkey'
  });
  
  const [documents, setDocuments] = useState<{
    identity?: File;
    address?: File;
    income?: File;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (type: 'identity' | 'address' | 'income', file: File) => {
    setDocuments({
      ...documents,
      [type]: file
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      // Upload documents first
      for (const [type, file] of Object.entries(documents)) {
        if (file) {
          await uploadDocument(file, type as any, user.id);
        }
      }

      // Submit KYC application
      await submitKYCApplication({
        userId: user.id,
        personalInfo: formData,
        documents: [],
        status: 'pending'
      });

      toast.success('KYC başvurunuz başarıyla gönderildi!');
      setStep(4);
    } catch (error) {
      toast.error('KYC başvurusu gönderilirken hata oluştu');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Kişisel Bilgiler</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TC Kimlik No</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  maxLength={11}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uyruk</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Turkish">Türk</option>
                  <option value="Other">Diğer</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Adres Bilgileri</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange as any}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ülke</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Turkey">Türkiye</option>
                    <option value="Other">Diğer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Belge Yükleme</h3>
            
            <div className="space-y-4">
              <DocumentUpload
                title="Kimlik Belgesi"
                description="TC Kimlik kartı ön ve arka yüzü"
                icon={User}
                onFileSelect={(file) => handleFileUpload('identity', file)}
                selectedFile={documents.identity}
              />
              
              <DocumentUpload
                title="Adres Belgesi"
                description="Son 3 ay içinde alınmış fatura veya banka ekstresi"
                icon={MapPin}
                onFileSelect={(file) => handleFileUpload('address', file)}
                selectedFile={documents.address}
              />
              
              <DocumentUpload
                title="Gelir Belgesi (Opsiyonel)"
                description="Maaş bordrosu veya gelir belgesi"
                icon={FileText}
                onFileSelect={(file) => handleFileUpload('income', file)}
                selectedFile={documents.income}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900">Başvuru Gönderildi!</h3>
            
            <p className="text-gray-600 max-w-md mx-auto">
              KYC başvurunuz başarıyla gönderildi. İnceleme süreci 1-3 iş günü sürmektedir. 
              Sonuç hakkında e-posta ile bilgilendirileceksiniz.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Başvuru Numarası:</strong> KYC-{Date.now()}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-emerald-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Geri
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                İleri
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <span>Başvuruyu Gönder</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface DocumentUploadProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onFileSelect: (file: File) => void;
  selectedFile?: File;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title,
  description,
  icon: Icon,
  onFileSelect,
  selectedFile
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-400 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          
          {selectedFile ? (
            <div className="flex items-center space-x-2 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
          ) : (
            <label className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Dosya Seç</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};