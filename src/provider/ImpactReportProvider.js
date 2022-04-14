import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { SPRING_SUMMER_CORN_CROP_LIST } from '../config/StaticData';

const ImpactReportContext = React.createContext(null);

const ImpactReportProvider = ({ children }) => {
  const [enrollerId, setEnrollerId] = useState(null);
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    register,
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
    enrollerId,
    setEnrollerId,
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
