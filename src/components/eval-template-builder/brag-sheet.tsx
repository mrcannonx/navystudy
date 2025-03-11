"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DirectInput, DirectTextarea } from './direct-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, PlusCircle, Star, X, Trash2 } from 'lucide-react'
import { BragSheetEntry, SectionKey } from './types'
import { FeatureTooltip } from './components/feature-tooltip'
import { BragSheetItem } from './brag-sheet-item'

interface BragSheetProps {
  entries: BragSheetEntry[];
  onAddEntryAction: (entry: Omit<BragSheetEntry, 'id'>) => void;
  onSelectEntryAction: (entry: BragSheetEntry) => Promise<void>;
  onDeleteEntryAction?: (entryId: number | string) => void;
  onUpdateEntryAction?: (entry: BragSheetEntry) => void;
}

// Define a type for the form state
interface BragSheetFormState {
  title: string;
  date: string;
  category: SectionKey;
  description: string;
  metrics: string[];
}

// BragSheetForm component to handle the form state as a single object
function BragSheetForm({
  onSubmit,
  onCancel,
  initialEntry
}: {
  onSubmit: (entry: Omit<BragSheetEntry, 'id'> | BragSheetEntry) => void;
  onCancel: () => void;
  initialEntry?: BragSheetEntry;
}) {
  // Use a single state object for all form fields
  const [formState, setFormState] = useState<BragSheetFormState>(() => {
    if (initialEntry) {
      return {
        title: initialEntry.title,
        date: initialEntry.date,
        category: initialEntry.category,
        description: initialEntry.description,
        metrics: initialEntry.metrics.length > 0 ? initialEntry.metrics : ['']
      };
    }
    return {
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'professional',
      description: '',
      metrics: ['']
    };
  });
  
  // Track if we're editing an existing entry
  const isEditing = !!initialEntry;

  // Update a specific field in the form state
  const updateField = (field: keyof BragSheetFormState, value: any) => {
    // Log what field is being updated and with what value
    console.log(`Updating field "${field}" with value:`, value);
    
    // Create the new state object first
    const newState = {
      ...formState,
      [field]: value
    };
    
    // Log the complete new state object before setting it
    console.log("New form state will be:", newState);
    
    // Use the functional form of setState to ensure we're working with the latest state
    setFormState(prev => {
      // Log the previous state that React is providing
      console.log("Previous state in setState:", prev);
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Handle metric changes
  const handleMetricChange = (index: number, value: string) => {
    const newMetrics = [...formState.metrics];
    newMetrics[index] = value;
    updateField('metrics', newMetrics);
  };

  // Add a new metric field
  const handleAddMetric = () => {
    updateField('metrics', [...formState.metrics, '']);
  };

  // Remove a metric field
  const handleRemoveMetric = (index: number) => {
    const newMetrics = [...formState.metrics];
    newMetrics.splice(index, 1);
    const finalMetrics = newMetrics.length > 0 ? newMetrics : [''];
    updateField('metrics', finalMetrics);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Filter out empty metrics
    const filteredMetrics = formState.metrics.filter(m => m.trim() !== '');
    
    if (isEditing && initialEntry) {
      // For editing, preserve the id and added status
      const updatedEntry: BragSheetEntry = {
        ...initialEntry,
        ...formState,
        metrics: filteredMetrics
      };
      
      onSubmit(updatedEntry);
    } else {
      // For new entries
      const entry: Omit<BragSheetEntry, 'id'> = {
        ...formState,
        metrics: filteredMetrics,
        added: false
      };
      
      onSubmit(entry);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={formState.title}
          onChange={e => updateField('title', e.target.value)}
          placeholder="Brief title of accomplishment"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={formState.date}
            onChange={e => updateField('date', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            value={formState.category}
            onValueChange={value => updateField('category', value as SectionKey)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional Knowledge</SelectItem>
              <SelectItem value="quality">Quality of Work</SelectItem>
              <SelectItem value="climate">Command Climate/EO</SelectItem>
              <SelectItem value="military">Military Bearing/Character</SelectItem>
              <SelectItem value="accomplishment">Job Accomplishment/Init.</SelectItem>
              <SelectItem value="teamwork">Teamwork</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <DirectTextarea
          value={formState.description}
          onChangeAction={(value) => {
            // Log the current form state to help debug
            console.log("Before description update:", formState);
            // Update the description field
            updateField('description', value);
            // Log the updated form state
            console.log("After description update:", {...formState, description: value});
          }}
          placeholder="Detailed description of accomplishment"
          rows={3}
          onBlur={() => console.log("Description blur, current value:", formState.description)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Metrics</label>
        <div className="space-y-2">
          {formState.metrics.map((metric, index) => (
            <div key={index} className="flex gap-2">
              <DirectInput
                value={metric}
                onChangeAction={(value) => {
                  // Log the current form state to help debug
                  console.log("Before metric update:", formState);
                  // Update the metric field
                  handleMetricChange(index, value);
                  // Log that we're updating the metric
                  console.log(`Updating metric ${index} to:`, value);
                  // Log the expected updated state
                  const newMetrics = [...formState.metrics];
                  newMetrics[index] = value;
                  console.log("Expected metrics after update:", newMetrics);
                }}
                placeholder={`Metric ${index + 1} (e.g., "3 servers", "25% reduction")`}
                onBlur={() => console.log(`Metric ${index} blur, current value:`, formState.metrics[index])}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveMetric(index)}
                disabled={formState.metrics.length <= 1 && index === 0}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={handleAddMetric}
        >
          <PlusCircle size={14} className="mr-1" />
          Add Metric
        </Button>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Save Entry
        </Button>
      </div>
    </div>
  );
}

export default function BragSheet({ entries, onAddEntryAction, onSelectEntryAction, onDeleteEntryAction, onUpdateEntryAction }: BragSheetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BragSheetEntry | null>(null);

  // Get category display name
  const getCategoryDisplayName = (category: SectionKey): string => {
    const categoryMap: Record<SectionKey, string> = {
      professional: "Professional Knowledge",
      quality: "Quality of Work",
      climate: "Command Climate/EO",
      military: "Military Bearing/Character",
      accomplishment: "Job Accomplishment/Init.",
      teamwork: "Teamwork",
      leadership: "Leadership"
    };
    return categoryMap[category] || category;
  };

  // Handle form submission from BragSheetForm
  const handleFormSubmit = (entry: Omit<BragSheetEntry, 'id'> | BragSheetEntry) => {
    if ('id' in entry && onUpdateEntryAction) {
      // Update existing entry
      onUpdateEntryAction(entry as BragSheetEntry);
    } else {
      // Add new entry
      onAddEntryAction(entry as Omit<BragSheetEntry, 'id'>);
    }
    setIsAdding(false);
    setEditingEntry(null);
  };

  // Start editing an entry
  const handleEditEntry = (entry: BragSheetEntry) => {
    setEditingEntry(entry);
    setIsAdding(true);
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="bg-green-50 border-b border-green-100 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center text-green-800">
            <Star size={16} className="mr-2" />
            Brag Sheet
          </CardTitle>
          <div>
            <FeatureTooltip
              color="green"
              content={
                <div>
                  <p className="font-medium mb-1">Brag Sheet</p>
                  <p className="mb-2">A year-round log of your accomplishments with detailed metrics that can be directly added to your evaluation.</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Log accomplishments as they happen throughout the year</li>
                    <li>Include specific metrics for each achievement</li>
                    <li>Categorize entries by evaluation section</li>
                    <li>Add entire entries to your evaluation with one click</li>
                    <li>Track which accomplishments have already been used</li>
                  </ul>
                </div>
              }
            />
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Calendar size={12} className="mr-1.5" />
          Year-round accomplishment log
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isAdding ? (
          <BragSheetForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsAdding(false);
              setEditingEntry(null);
            }}
            initialEntry={editingEntry || undefined}
          />
        ) : (
          <div className="text-sm divide-y">
            {entries.map(entry => (
              <BragSheetItem
                key={entry.id}
                entry={entry}
                onSelectAction={onSelectEntryAction}
                onEditAction={handleEditEntry}
                onDeleteAction={onDeleteEntryAction}
                categoryDisplayName={getCategoryDisplayName(entry.category)}
              />
            ))}
            
            {entries.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No brag sheet entries yet.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 py-2 px-3">
        <button 
          className="text-green-700 text-xs hover:underline flex items-center w-full"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle size={12} className="mr-1" />
          Log New Accomplishment
        </button>
      </CardFooter>
    </Card>
  );
}
