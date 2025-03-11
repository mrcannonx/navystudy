import axios from 'axios';

export interface SyncError {
  message: string;
  status?: number;
  isNetworkError: boolean;
  isServerError: boolean;
  isClientError: boolean;
  isUnknownError?: boolean;
}

interface SyncOperation {
  type: 'card_response' | 'study_session' | 'analytics';
  data: any;
  timestamp: number;
  sessionId: string;
  retryCount?: number;
}

type SyncResult = {
  success: true;
  data: any;
} | {
  success: false;
  error: SyncError;
};

class FlashcardSyncAPI {
  private baseURL = '/api/flashcards';
  private axiosInstance = axios.create({
    baseURL: this.baseURL,
    timeout: 10000,
  });

  async syncOperations(operations: SyncOperation[]): Promise<SyncResult> {
    try {
      const response = await this.axiosInstance.post('/sync', {
        operations,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Return structured error information
        const syncError: SyncError = {
          message: error.message,
          status: error.response?.status,
          isNetworkError: !error.response,
          isServerError: error.response?.status ? error.response.status >= 500 : false,
          isClientError: error.response?.status ? error.response.status >= 400 && error.response.status < 500 : false,
        };
        return {
          success: false,
          error: syncError,
        };
      }
      return {
        success: false,
        error: {
          message: 'Unknown error occurred',
          isNetworkError: false,
          isServerError: false,
          isClientError: false,
          isUnknownError: true,
        },
      };
    }
  }

  async validateSession(sessionId: string) {
    try {
      const response = await this.axiosInstance.get(`/sessions/${sessionId}/validate`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to validate session',
      };
    }
  }

  async getLastSyncTimestamp(sessionId: string) {
    try {
      const response = await this.axiosInstance.get(`/sessions/${sessionId}/last-sync`);
      return {
        success: true,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get last sync timestamp',
      };
    }
  }
}

export const flashcardSyncAPI = new FlashcardSyncAPI(); 