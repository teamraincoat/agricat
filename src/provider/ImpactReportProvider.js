import React, {
  useContext, useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { SPRING_SUMMER_CORN_CROP_LIST } from '../config/StaticData';

const ImpactReportContext = React.createContext(null);

const ImpactReportProvider = ({ children }) => {
  const [enrollmentId, setEnrollmentId] = useState(null);
  const {
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      maizeCultivation: [...SPRING_SUMMER_CORN_CROP_LIST],
    },
  });

  const reportData = {
    control,
    getValues,
    errors,
    reset,
    enrollmentId,
    setEnrollmentId,
  };

  return (
    <ImpactReportContext.Provider value={reportData}>{children}</ImpactReportContext.Provider>
  );
};

const useReports = () => {
  const report = useContext(ImpactReportContext);
  if (report == null) {
    throw new Error('useReports() called outside of a ImpactReportProvider?');
  }
  return report;
};

export { ImpactReportProvider, useReports };
