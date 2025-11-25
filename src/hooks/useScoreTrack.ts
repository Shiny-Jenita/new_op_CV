"use client"
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useScoreTracker = (fieldName = 'education') => {
  const { control, setValue } = useFormContext();
  
  const educationData = useWatch({
    control,
    name: fieldName
  });
  
  useEffect(() => {
    if (!educationData || !Array.isArray(educationData)) return;
    
    educationData.forEach((education, index) => {
      if (education?.score?.[0]) {
        const scoreJson = JSON.stringify({
          type: education.score[0].type || '',
          value: education.score[0].value || ''
        });
        
        const currentJson = education.scoreJson || '{}';
        if (currentJson !== scoreJson) {
          setValue(`${fieldName}.${index}.scoreJson`, scoreJson, { 
            shouldValidate: false,
            shouldDirty: true 
          });
          console.log(`Updated score JSON for ${fieldName} ${index}:`, scoreJson);
        }
      }
    });
  }, [educationData, setValue, fieldName]);
  
  return {
    getScoreJson: (index) => {
      if (!educationData?.[index]?.score?.[0]) return '{}';
      
      return JSON.stringify({
        type: educationData[index].score[0].type || '',
        value: educationData[index].score[0].value || ''
      });
    }
  };
};