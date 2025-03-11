import { useState } from 'react';
import { Summarizer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, Eye, FileText, Calendar, Clock } from 'lucide-react';

interface EnhancedSavedSummaryCardProps {
  summary: Summarizer;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  colorIndex?: number;
}

const GRADIENT_COLORS = [
  'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20',
  'from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20',
  'from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20',
  'from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20',
  'from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/20',
  'from-cyan-50 to-cyan-100 dark:from-cyan-950/40 dark:to-cyan-900/20',
];

const ACCENT_COLORS = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300',
];

export function EnhancedSavedSummaryCard({ summary, onDelete, onEdit, colorIndex = 0 }: EnhancedSavedSummaryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(summary.title);
  
  // Use modulo to ensure we always have a valid color even if colorIndex is out of range
  const gradientColor = GRADIENT_COLORS[colorIndex % GRADIENT_COLORS.length];
  const accentColor = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];

  const formatBadgeColor = (format: string) => {
    switch (format) {
      case 'bullet':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'tldr':
        return 'bg-green-500 hover:bg-green-600';
      case 'qa':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatLabel = (format: string) => {
    switch (format) {
      case 'bullet':
        return 'Bullet Points';
      case 'tldr':
        return 'TL;DR';
      case 'qa':
        return 'Q&A';
      default:
        return format.toUpperCase();
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEdit(summary.id, editTitle);
      setIsEditing(false);
    }
  };

  // Calculate approximate reading time
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  const readingTime = calculateReadingTime(summary.content);

  return (
    <Card className={`w-full overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 summary-card bg-gradient-to-br ${gradientColor}`}>
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md bg-white dark:bg-gray-800"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">Save</Button>
              <Button size="sm" variant="outline" onClick={() => {
                setEditTitle(summary.title);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{summary.title}</CardTitle>
              <Badge className={`${formatBadgeColor(summary.format)} transition-colors`}>
                {formatLabel(summary.format)}
              </Badge>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div 
          className="line-clamp-3 text-gray-700 dark:text-gray-300 prose dark:prose-invert prose-sm"
          dangerouslySetInnerHTML={{ __html: summary.content }}
        />
        
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/20">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="max-w-4xl max-h-[80vh] overflow-y-auto"
              aria-describedby="summary-view-description"
            >
              <div id="summary-view-description" className="sr-only">
                View full summary content and original text
              </div>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{summary.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={formatBadgeColor(summary.format)}>
                    {formatLabel(summary.format)}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
                  </span>
                </div>
              </DialogHeader>
              <Tabs defaultValue="summary" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="original" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Original Text
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <div 
                    className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-ul:text-gray-800 dark:prose-ul:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: summary.content }}
                  />
                </TabsContent>
                <TabsContent value="original" className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <div 
                    className="prose dark:prose-invert max-w-none whitespace-pre-wrap"
                  >
                    {summary.original_text}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(summary.id)}
          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}