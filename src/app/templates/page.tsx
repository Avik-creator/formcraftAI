import React from 'react';
import Templates from '@/components/templates/Templates';
import { getAllTemplatesAction } from '@/backend/actions/template';

export const revalidate = 3600;

const TemplatesPage = async () => {
  const templates = await getAllTemplatesAction()
    .then((res) => res?.data)
    .catch(() => []);

  return <Templates templates={templates} />;
};
export default TemplatesPage;
