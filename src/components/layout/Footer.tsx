import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Twitter, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">DECARBONIZE</h3>
                <p className="text-sm text-gray-400">Carbon Credit Token</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Uluslararası karbon nötrleme projesi ile dünyayı daha sürdürülebilir bir geleceğe taşıyoruz. 
              ReefChain altyapısı ile karbon kredilerini tokenleştiriyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Hızlı Linkler</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-emerald-400 transition-colors">Hakkımızda</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-emerald-400 transition-colors">Projeler</Link></li>
              <li><Link to="/trading" className="text-gray-300 hover:text-emerald-400 transition-colors">Trading</Link></li>
              <li><Link to="/ico" className="text-gray-300 hover:text-emerald-400 transition-colors">ICO</Link></li>
              <li><Link to="/whitepaper" className="text-gray-300 hover:text-emerald-400 transition-colors">Whitepaper</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Cüzdan</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Staking</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Governance</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">API Dokümantasyonu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Destek</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">İletişim</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm">İstanbul, Türkiye</p>
                  <p className="text-gray-400 text-xs">Blockchain Vadisi</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:info@decarbonize.com" className="text-gray-300 text-sm hover:text-emerald-400 transition-colors">
                  info@decarbonize.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <a href="tel:+905551234567" className="text-gray-300 text-sm hover:text-emerald-400 transition-colors">
                  +90 555 123 45 67
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 DECARBONIZE Token. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Kullanım Şartları</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};