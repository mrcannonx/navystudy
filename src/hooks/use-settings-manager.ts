"use client"

import { useCallback } from 'react';
import { useStudySettings } from './use-study-settings';
import { StudySettingPath } from '@/types/study-settings';
import { useToast } from '@/components/ui/use-toast';

export function useSettingsManager() {
  const { settings, updateSettings, isLoading } = useStudySettings();
  const { toast } = useToast();

  const updateSetting = useCallback(async (path: StudySettingPath, value: any) => {
    if (!settings || isLoading) {
      console.warn('Cannot update settings while loading');
      return;
    }

    try {
      // Create a deep clone of the settings to avoid mutation issues
      const newSettings = structuredClone(settings);
      const pathParts = path.split('.');
      let current: any = newSettings;
      
      // Navigate to the nested property
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        // Ensure we're creating a new object at each level
        if (i < pathParts.length - 2) {
          current[part] = { ...current[part] };
        }
        current = current[part];
      }
      
      // Update the value
      current[pathParts[pathParts.length - 1]] = value;

      await updateSettings(newSettings);
      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update setting',
        variant: 'destructive',
      });
    }
  }, [settings, updateSettings, isLoading, toast]);

  return {
    settings,
    updateSetting,
    isLoading
  };
}