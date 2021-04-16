import React from 'react';
import FormPlaceTemplate, { FormPlaceTemplateProps } from './template';

/**
 * FormPlace
 */
const FormPlace: React.FC<FormPlaceTemplateProps> = (props) => {
  return <FormPlaceTemplate {...props} />;
};

export default FormPlace;
