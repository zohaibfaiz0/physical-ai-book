import React, { useState, useEffect } from 'react';
import { getMe, getToken, API_URL } from '../lib/auth-client';

interface CompletionButtonProps {
  chapterId: string;
}

interface ProgressResponse {
  chapter_id: string;
  completed: boolean;
  completed_at: string | null;
}

interface ProgressListResponse {
  progress: Array<{
    chapter_id: string;
    completed_at: string;
  }>;
}

const CompletionButton: React.FC<CompletionButtonProps> = ({ chapterId }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);

        if (userData) {
          await checkCompletionStatus(userData.id);
        }
      } catch (error) {
        console.error('Error fetching user or completion status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chapterId]);

  const checkCompletionStatus = async (userId: string) => {
    try {
      const token = getToken();
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: ProgressListResponse = await response.json();
        const completedChapters = data.progress.map(item => item.chapter_id);
        setIsCompleted(completedChapters.includes(chapterId));
      }
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  };

  const toggleCompletion = async () => {
    if (!user) {
      alert('Please sign in to track your progress');
      return;
    }

    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/progress/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_id: chapterId }),
      });

      if (response.ok) {
        const data: ProgressResponse = await response.json();
        setIsCompleted(data.completed);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update progress');
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
      alert(`Error updating progress: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <button className="completion-btn loading" disabled>
      <span>Loading...</span>
    </button>;
  }

  if (!user) {
    return <button
      className="completion-btn disabled"
      disabled
      title="Sign in to track your progress"
    >
      <span>🔒 Sign in to track</span>
    </button>;
  }

  return (
    <button
      className={`completion-btn ${isCompleted ? 'completed' : 'incomplete'}`}
      onClick={toggleCompletion}
      disabled={loading}
      title={isCompleted ? 'Click to mark as incomplete' : 'Click to mark as complete'}
    >
      <span>{isCompleted ? '✓ Completed' : 'Mark Complete'}</span>
    </button>
  );
};

export default CompletionButton;