import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { getMe, getToken } from '../lib/auth-client';
import { API_URL } from '../lib/auth-client';

const TOTAL_CHAPTERS = 20;

interface ProgressItem {
  chapter_id: string;
  completed_at: string;
}

interface ProgressListResponse {
  progress: ProgressItem[];
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        if (!userData) {
          throw new Error('User not authenticated');
        }

        setUser(userData);

        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:8000/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch progress data');
        }

        const data: ProgressListResponse = await response.json();
        setProgress(data.progress);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getCompletionPercentage = () => {
    if (progress.length === 0) return 0;
    // Assuming we have a way to know total chapters, for now we'll calculate based on what we have
    // In a real scenario, we'd have a list of all possible chapters
    return Math.min(100, Math.round((progress.length / TOTAL_CHAPTERS) * 100)); // Simplified calculation
  };

  if (loading) {
    return (
      <Layout title="Progress Dashboard" description="Track your learning progress">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Loading...</h1>
              <p>Your progress data is being loaded.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Progress Dashboard" description="Track your learning progress">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Error Loading Progress</h1>
              <p>Please make sure you're signed in and try again.</p>
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Progress Dashboard" description="Track your learning progress">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Sign In Required</h1>
              <p>Please sign in to view your progress dashboard.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Progress Dashboard" description="Track your learning progress">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Learning Progress Dashboard</h1>

            <div className="card margin-bottom--lg">
              <div className="card__header">
                <h2>Welcome, {user.name}!</h2>
              </div>
              <div className="card__body">
                <div className="progress-summary">
                  <h3>Overall Progress</h3>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  <p>You have completed {progress.length} chapter{progress.length !== 1 ? 's' : ''}.</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <h2>Completed Chapters</h2>
              </div>
              <div className="card__body">
                {progress.length > 0 ? (
                  <table className="progress-table">
                    <thead>
                      <tr>
                        <th>Chapter ID</th>
                        <th>Date Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progress.map((item, index) => (
                        <tr key={index}>
                          <td>{item.chapter_id}</td>
                          <td>{new Date(item.completed_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>You haven't completed any chapters yet. Start learning to track your progress!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;