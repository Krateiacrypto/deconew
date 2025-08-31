import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Mail, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Play,
  Globe,
  Target,
  Heart,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useMaintenanceStore } from '../../store/maintenanceStore';

export const MaintenancePage: React.FC = () => {
  const { content } = useMaintenanceStore();
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ 
        background: `linear-gradient(135deg, ${content.backgroundColor}dd, ${content.accentColor}22)`,
        color: content.textColor
      }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-300/10 to-blue-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-8">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${content.accentColor}, #3b82f6)` }}
            >
              <span className="text-white font-bold text-3xl">CO₂</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            {content.title}
          </h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-400/30 backdrop-blur-sm"
          >
            <Clock className="w-5 h-5 mr-2" style={{ color: content.accentColor }} />
            <span className="text-xl font-semibold">{content.subtitle}</span>
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 opacity-90">Lansmanımıza Kalan Süre</h3>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="relative">
                <div 
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: content.accentColor }}>
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm opacity-80 capitalize">
                    {unit === 'days' ? 'Gün' : 
                     unit === 'hours' ? 'Saat' : 
                     unit === 'minutes' ? 'Dakika' : 'Saniye'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl leading-relaxed opacity-90 mb-8">
              {content.description}
            </p>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 mr-3" style={{ color: content.accentColor }} />
                  <h4 className="text-xl font-bold">Misyonumuz</h4>
                </div>
                <p className="opacity-90 leading-relaxed">{content.mission}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 mr-3" style={{ color: content.accentColor }} />
                  <h4 className="text-xl font-bold">Vizyonumuz</h4>
                </div>
                <p className="opacity-90 leading-relaxed">{content.vision}</p>
              </div>
            </div>

            {/* Video Section */}
            {content.videoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-12"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-center mb-6">
                    <Play className="w-6 h-6 mr-3" style={{ color: content.accentColor }} />
                    <h4 className="text-xl font-bold">Proje Tanıtım Videosu</h4>
                  </div>
                  <div className="relative w-full max-w-3xl mx-auto">
                    <iframe
                      src={getVideoEmbedUrl(content.videoUrl)}
                      className="w-full h-64 md:h-80 rounded-xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Additional Info */}
            {content.additionalInfo && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
                <p className="text-lg leading-relaxed opacity-90">{content.additionalInfo}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-8 opacity-90">Platform Özellikleri</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Leaf className="w-8 h-8 mb-4 mx-auto" style={{ color: content.accentColor }} />
              <h4 className="font-bold mb-2">Karbon Kredisi Tokenleştirme</h4>
              <p className="text-sm opacity-80">Blockchain ile şeffaf karbon kredisi ticareti</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Zap className="w-8 h-8 mb-4 mx-auto" style={{ color: content.accentColor }} />
              <h4 className="font-bold mb-2">ReefChain Altyapısı</h4>
              <p className="text-sm opacity-80">Hızlı ve düşük maliyetli işlemler</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Globe className="w-8 h-8 mb-4 mx-auto" style={{ color: content.accentColor }} />
              <h4 className="font-bold mb-2">Global Erişim</h4>
              <p className="text-sm opacity-80">Dünya çapında karbon kredisi piyasası</p>
            </div>
          </div>
        </motion.div>

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-6">Bizimle İletişime Geçin</h4>
            
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-5 h-5 mr-2" style={{ color: content.accentColor }} />
              <a 
                href={`mailto:${content.contactEmail}`}
                className="hover:opacity-80 transition-opacity"
                style={{ color: content.accentColor }}
              >
                {content.contactEmail}
              </a>
            </div>

            <div className="flex items-center justify-center space-x-6">
              {content.socialLinks.twitter && (
                <a
                  href={content.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              
              {content.socialLinks.linkedin && (
                <a
                  href={content.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              
              {content.socialLinks.telegram && (
                <a
                  href={content.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Estimated Launch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center"
        >
          <p className="text-lg opacity-80">
            Tahmini Lansman: <span className="font-bold" style={{ color: content.accentColor }}>{content.estimatedTime}</span>
          </p>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="fixed bottom-8 right-8"
        >
          <button 
            className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
            style={{ background: `linear-gradient(135deg, ${content.accentColor}, #3b82f6)` }}
            onClick={() => window.open(`mailto:${content.contactEmail}`, '_blank')}
          >
            <Mail className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
    </div>
  );
};