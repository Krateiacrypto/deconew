import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { KYCForm } from '../components/kyc/KYCForm';
import { useKYCStore } from '../store/kycStore';
import { useAuthStore } from '../store/authStore';

export const KYCPage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchUserKYC } = useKYCStore();
  const [userKYC, setUserKYC] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserKYC = async () => {
      if (user?.id) {
        const kyc = await fetchUserKYC(user.id);
        setUserKYC(kyc);
      }
      setIsLoading(false);
    };

    loadUserKYC();
  }, [user?.id, fetchUserKYC]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-emerald-600" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'under_review':
        return <Clock className="w-8 h-8 text-blue-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: 'KYC Onaylandı',
          message: 'Kimlik doğrulamanız başarıyla tamamlandı. Artık tüm platform özelliklerini kullanabilirsiniz.',
          color: 'emerald'
        };
      case 'rejected':
        return {
          title: 'KYC Reddedildi',
          message: 'Kimlik doğrulamanız reddedildi. Lütfen belgelerinizi kontrol ederek yeniden başvurun.',
          color: 'red'
        };
      case 'under_review':
        return {
          title: 'İnceleme Aşamasında',
          message: 'Başvurunuz inceleme aşamasında. Sonuç hakkında e-posta ile bilgilendirileceksiniz.',
          color: 'blue'
        };
      default:
        return {
          title: 'KYC Gerekli',
          message: 'Platform özelliklerini kullanabilmek için kimlik doğrulaması yapmanız gerekmektedir.',
          color: 'yellow'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kimlik Doğrulama (KYC)
          </h1>
          <p className="text-xl text-gray-600">
            Güvenli işlemler için kimlik doğrulamanızı tamamlayın
          </p>
        </motion.div>

        {/* KYC Status or Form */}
        {userKYC ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <div className="mb-6">
              {getStatusIcon(userKYC.status)}
            </div>
            
            {(() => {
              const statusInfo = getStatusMessage(userKYC.status);
              return (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{statusInfo.title}</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{statusInfo.message}</p>
                  
                  {userKYC.status === 'rejected' && userKYC.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-red-800 mb-2">Red Sebebi:</h4>
                      <p className="text-red-700 text-sm">{userKYC.rejectionReason}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Başvuru Bilgileri</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="text-left">
                        <span className="text-gray-600">Başvuru Tarihi:</span>
                        <p className="font-medium">{new Date(userKYC.submittedAt).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="text-left">
                        <span className="text-gray-600">Başvuru No:</span>
                        <p className="font-medium font-mono">KYC-{userKYC.id}</p>
                      </div>
                      {userKYC.reviewedAt && (
                        <div className="text-left">
                          <span className="text-gray-600">İnceleme Tarihi:</span>
                          <p className="font-medium">{new Date(userKYC.reviewedAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {userKYC.status === 'rejected' && (
                    <button className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                      Yeniden Başvur
                    </button>
                  )}
                </>
              );
            })()}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* KYC Requirements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gerekli Belgeler</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Kimlik Belgesi</h4>
                    <p className="text-sm text-gray-600">TC Kimlik kartı ön/arka</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Adres Belgesi</h4>
                    <p className="text-sm text-gray-600">Fatura veya banka ekstresi</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Gelir Belgesi</h4>
                    <p className="text-sm text-gray-600">Maaş bordrosu (opsiyonel)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KYC Form */}
            <KYCForm />
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Güvenlik ve Gizlilik</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                Tüm kişisel verileriniz 256-bit SSL şifreleme ile korunmaktadır. 
                Belgeleriniz sadece kimlik doğrulama amacıyla kullanılır ve 
                KVKK kapsamında güvenli bir şekilde saklanır. Verileriniz hiçbir 
                şekilde üçüncü taraflarla paylaşılmaz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};