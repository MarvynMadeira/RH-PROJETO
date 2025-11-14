'use client';

import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { officialFormSurveyJSON } from '@/schemas/officialForm';

interface FormularioAssociadoProps {
  onComplete: (data: any) => void;
  onUploadFile?: (file: File) => Promise<string>;
}

export default function FormularioAssociado({
  onComplete,
  onUploadFile,
}: FormularioAssociadoProps) {
  const survey = new Model(officialFormSurveyJSON);

  // Configurar tema
  survey.applyTheme({
    isPanelless: false,
  });

  // Handler de conclusão
  survey.onComplete.add((sender) => {
    onComplete(sender.data);
  });

  // Handler de upload (se fornecido)
  if (onUploadFile) {
    survey.onUploadFiles.add(async (sender, options) => {
      try {
        const file = options.files[0];
        const key = await onUploadFile(file);
        options.callback('success', [
          {
            file: file,
            content: key,
          },
        ]);
      } catch (error) {
        options.callback('error');
      }
    });
  }

  return <Survey model={survey} />;
}
