import { useState } from 'react';
import { Summarizer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface SavedSummaryCardProps {
  summary: Summarizer;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function SavedSummaryCard({ summary, onDelete, onEdit }: SavedSummaryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(summary.title);

  const formatBadgeColor = (format: string) => {
    switch (format) {
      case 'bullet':
        return 'bg-blue-500';
      case 'tldr':
        return 'bg-green-500';
      case 'qa':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSaveEdit = () => {
    onEdit(summary.id, editTitle);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-xl">{summary.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={formatBadgeColor(summary.format)}>
                  {summary.format.toUpperCase()}
                </Badge>
              </div>
            </>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
        </div>
      </CardHeader>

      <CardContent>
        <div 
          className="line-clamp-3 text-gray-600 dark:text-gray-300 prose dark:prose-invert prose-sm"
          dangerouslySetInnerHTML={{ __html: summary.content }}
        />
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Full
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
                <DialogTitle>{summary.title}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="original">Original Text</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4">
                  <div 
                    className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-ul:text-gray-800 dark:prose-ul:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: summary.content }}
                  />
                </TabsContent>
                <TabsContent value="original" className="mt-4">
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: summary.original_text }}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(summary.id)}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
