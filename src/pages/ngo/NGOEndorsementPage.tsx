/**
 * NGO Endorsement Page
 * Page wrapper for NGOEndorsementForm component
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import NGOEndorsementForm from '../../components/ngo/NGOEndorsementForm';

export const NGOEndorsementPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return <NGOEndorsementForm projectId={projectId ? parseInt(projectId) : undefined} />;
};

export default NGOEndorsementPage;
