import { create } from 'zustand';
import { KYCApplication, KYCDocument } from '../types';

interface KYCState {
  applications: KYCApplication[];
  documents: KYCDocument[];
  isLoading: boolean;
  
  // Actions
  fetchKYCApplications: () => Promise<void>;
  fetchUserKYC: (userId: string) => Promise<KYCApplication | null>;
  submitKYCApplication: (application: Omit<KYCApplication, 'id' | 'submittedAt'>) => Promise<void>;
  uploadDocument: (file: File, type: KYCDocument['type'], userId: string) => Promise<void>;
  reviewKYCApplication: (applicationId: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>;
  updateKYCStatus: (userId: string, status: KYCApplication['status']) => Promise<void>;
}

export const useKYCStore = create<KYCState>((set, get) => ({
  applications: [],
  documents: [],
  isLoading: false,

  fetchKYCApplications: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockApplications: KYCApplication[] = [
        {
          id: '1',
          userId: '3',
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            nationality: 'Turkish',
            idNumber: '12345678901',
            address: 'Atatürk Cad. No:123',
            city: 'Istanbul',
            postalCode: '34000',
            country: 'Turkey'
          },
          documents: [],
          status: 'pending',
          submittedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          userId: '4',
          personalInfo: {
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: '1985-05-15',
            nationality: 'Turkish',
            idNumber: '98765432109',
            address: 'İstiklal Cad. No:456',
            city: 'Ankara',
            postalCode: '06000',
            country: 'Turkey'
          },
          documents: [],
          status: 'under_review',
          submittedAt: '2024-01-10T14:30:00Z'
        }
      ];
      
      set({ applications: mockApplications, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUserKYC: async (userId: string) => {
    const { applications } = get();
    return applications.find(app => app.userId === userId) || null;
  },

  submitKYCApplication: async (application: Omit<KYCApplication, 'id' | 'submittedAt'>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newApplication: KYCApplication = {
        ...application,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString()
      };
      
      set(state => ({
        applications: [...state.applications, newApplication],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadDocument: async (file: File, type: KYCDocument['type'], userId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDocument: KYCDocument = {
        id: Date.now().toString(),
        userId,
        type,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        status: 'pending',
        uploadedAt: new Date().toISOString()
      };
      
      set(state => ({
        documents: [...state.documents, newDocument],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  reviewKYCApplication: async (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        applications: state.applications.map(app =>
          app.id === applicationId
            ? {
                ...app,
                status,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'admin',
                rejectionReason: status === 'rejected' ? notes : undefined
              }
            : app
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateKYCStatus: async (userId: string, status: KYCApplication['status']) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        applications: state.applications.map(app =>
          app.userId === userId ? { ...app, status } : app
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));