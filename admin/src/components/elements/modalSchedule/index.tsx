import React from 'react';
import ModalScheduleTemplate, { ModalScheduleTemplateProps } from './template';

/**
 * ModalSchedule
 */
const ModalSchedule: React.FC<ModalScheduleTemplateProps> = (props) => {
  return <ModalScheduleTemplate {...props} />;
};

export default ModalSchedule;
