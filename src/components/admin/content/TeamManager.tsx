import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  User,
  Mail,
  Linkedin,
  Twitter,
  Upload,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { TeamMember } from '../../../types/content';
import { useContentStore } from '../../../store/contentStore';

export const TeamManager: React.FC = () => {
  const { team, fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember, reorderTeam, isLoading } = useContentStore();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleSave = async (data: Partial<TeamMember>) => {
    if (editingMember) {
      await updateTeamMember(editingMember.id, data);
    } else {
      await createTeamMember({
        ...data,
        order: team.length + 1,
        isActive: true
      } as Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) {
      await deleteTeamMember(id);
    }
  };

  const toggleMemberStatus = async (member: TeamMember) => {
    await updateTeamMember(member.id, { isActive: !member.isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ekip Yönetimi</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Üye</span>
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-lg overflow-hidden ${
              !member.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Member Image */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-blue-500">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
              
              {/* Status Toggle */}
              <button
                onClick={() => toggleMemberStatus(member)}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  member.isActive ? 'bg-emerald-600' : 'bg-gray-600'
                } text-white`}
                title={member.isActive ? 'Gizle' : 'Göster'}
              >
                {member.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Member Info */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-3 mb-4">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-sm text-gray-500">Sıra: {member.order}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setShowForm(true);
                    }}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {team.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ekip üyesi yok</h3>
          <p className="text-gray-600 mb-4">İlk ekip üyesini ekleyerek başlayın</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            İlk Üyeyi Ekle
          </button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TeamMemberForm
            member={editingMember}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingMember(null);
            }}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSave: (data: Partial<TeamMember>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    image: member?.image || '',
    linkedin: member?.linkedin || '',
    twitter: member?.twitter || '',
    email: member?.email || '',
    order: member?.order || 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {member ? 'Ekip Üyesi Düzenle' : 'Yeni Ekip Üyesi'}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profil Fotoğrafı URL</label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/photo.jpg"
              />
              <button
                type="button"
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                title="Fotoğraf Yükle"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="1"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};