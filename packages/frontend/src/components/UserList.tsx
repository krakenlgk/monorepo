'use client';

import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      bio
      isActive
      createdAt
    }
  }
`;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
}

export default function UserList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading users: {error.message}</div>;

  const users: User[] = data?.users || [];

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Users ({users.length})</h2>
        <button 
          onClick={() => refetch()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
      
      {users.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No users found. Create your first user below!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {user.firstName} {user.lastName}
                  </h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                    📧 {user.email}
                  </p>
                  {user.bio && (
                    <p style={{ margin: '0 0 0.5rem 0', color: '#555', fontStyle: 'italic' }}>
                      &ldquo;{user.bio}&rdquo;
                    </p>
                  )}
                  <p style={{ margin: '0', fontSize: '0.875rem', color: '#888' }}>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: user.isActive ? '#d4edda' : '#f8d7da',
                    color: user.isActive ? '#155724' : '#721c24'
                  }}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}