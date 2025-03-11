import { Wifi, WifiOff, Cloud, AlertCircle, CheckCircle2, CloudOff, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Progress } from './progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { useEffect, useState } from 'react';

interface OfflineStatusProps {
  isOnline: boolean;
  isSyncing: boolean;
  hasPendingChanges: boolean;
  syncProgress: number;
  lastError: string | null;
  lastSyncAttempt: number | null;
  pendingOperationsCount?: number;
  className?: string;
}

export function OfflineStatus({
  isOnline,
  isSyncing,
  hasPendingChanges,
  syncProgress,
  lastError,
  lastSyncAttempt,
  pendingOperationsCount = 0,
  className
}: OfflineStatusProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [prevOnlineStatus, setPrevOnlineStatus] = useState(isOnline);

  // Handle online/offline transitions
  useEffect(() => {
    if (prevOnlineStatus !== isOnline) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 3000);
      setPrevOnlineStatus(isOnline);
      return () => clearTimeout(timer);
    }
  }, [isOnline, prevOnlineStatus]);

  const getStatusColor = () => {
    if (lastError) return 'text-red-500 dark:text-red-400';
    if (!isOnline) return 'text-yellow-500 dark:text-yellow-400';
    if (hasPendingChanges) return 'text-blue-500 dark:text-blue-400';
    return 'text-green-500 dark:text-green-400';
  };

  const getStatusIcon = () => {
    if (lastError) return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
    if (!isOnline) return <WifiOff className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
    if (isSyncing) return <ArrowUpDown className="h-4 w-4 animate-pulse text-blue-500 dark:text-blue-400" />;
    if (hasPendingChanges) return <CloudOff className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
    return <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />;
  };

  const getStatusText = () => {
    if (lastError) return 'Sync Error';
    if (!isOnline) return 'Offline Mode';
    if (isSyncing) return `Syncing (${syncProgress}%)`;
    if (hasPendingChanges) return `Changes Pending (${pendingOperationsCount})`;
    return 'All Changes Saved';
  };

  const getTooltipContent = () => {
    const parts = [];
    
    if (lastError) {
      parts.push(`Error: ${lastError}`);
    }
    
    if (lastSyncAttempt) {
      parts.push(`Last sync: ${formatDistanceToNow(lastSyncAttempt, { addSuffix: true })}`);
    }
    
    if (hasPendingChanges && !isSyncing) {
      parts.push(`${pendingOperationsCount} changes waiting to sync`);
      if (!isOnline) {
        parts.push('Changes will sync when back online');
      }
    }

    if (isSyncing) {
      parts.push(`Syncing ${syncProgress}% complete`);
    }
    
    return parts.join('\n');
  };

  return (
    <div className={cn('space-y-2 relative', className)}>
      {/* Online/Offline Notification */}
      {showNotification && (
        <div className={cn(
          'absolute -top-12 left-0 right-0 p-2 rounded-md text-sm text-center transition-all duration-300',
          isOnline 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        )}>
          {isOnline ? 'Back Online' : 'Offline Mode Active'}
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-sm transition-all duration-200">
              <div className="flex items-center">
                {getStatusIcon()}
              </div>
              
              <span className={cn('font-medium transition-colors duration-200', getStatusColor())}>
                {getStatusText()}
              </span>

              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500 ml-2 transition-opacity duration-200" />
              ) : (
                <WifiOff className="h-4 w-4 text-yellow-500 ml-2 transition-opacity duration-200" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="whitespace-pre-line">{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Progress Indicators */}
      {(isSyncing || hasPendingChanges) && (
        <div className="w-full space-y-1">
          <Progress 
            value={isSyncing ? syncProgress : 0} 
            className={cn(
              "h-1 transition-all duration-300",
              isSyncing ? "opacity-100" : "opacity-50"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {isSyncing 
                ? `Syncing changes (${syncProgress}%)`
                : `${pendingOperationsCount} changes pending`}
            </span>
            {lastSyncAttempt && (
              <span>
                Last sync: {formatDistanceToNow(lastSyncAttempt, { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {lastError && (
        <div className="text-xs text-red-500 mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Sync Error</p>
              <p>{lastError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 