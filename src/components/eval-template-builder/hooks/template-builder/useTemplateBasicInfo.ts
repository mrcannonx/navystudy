"use client"

import { useState, useEffect } from 'react';
import { EvaluationTemplateData } from '../../types';

interface UseTemplateBasicInfoProps {
  initialData?: Partial<EvaluationTemplateData>;
}

export const useTemplateBasicInfo = ({ initialData }: UseTemplateBasicInfoProps) => {
  // Basic template information
  const [rank, setRank] = useState(initialData?.rank !== undefined ? initialData.rank : 'E5');
  const [rating, setRating] = useState(initialData?.rating !== undefined ? initialData.rating : 'IT');
  const [role, setRole] = useState(initialData?.role !== undefined ? initialData.role : 'System Administrator');
  const [evalType, setEvalType] = useState(initialData?.evalType || 'Periodic');
  const [title, setTitle] = useState(initialData?.title || '');

  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      // Update basic template information
      setRank(initialData.rank !== undefined ? initialData.rank : 'E5');
      setRating(initialData.rating !== undefined ? initialData.rating : 'IT');
      setRole(initialData.role !== undefined ? initialData.role : 'System Administrator');
      setEvalType(initialData.evalType || 'Periodic');
      setTitle(initialData.title || '');
    }
  }, [initialData]);

  // Direct setters without logging
  const setRoleDirectly = (newRole: string) => {
    setRole(newRole);
  };

  const setTitleDirectly = (newTitle: string) => {
    setTitle(newTitle);
  };

  return {
    // State
    rank,
    rating,
    role,
    evalType,
    title,
    
    // State setters
    setRank,
    setRating,
    setRole: setRoleDirectly,
    setEvalType,
    setTitle: setTitleDirectly,
  };
};