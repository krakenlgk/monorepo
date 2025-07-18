'use client';

import { useQuery, gql } from '@apollo/client';
import UserList from '../components/UserList';
import CreateUserForm from '../components/CreateUserForm';

const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(HELLO_QUERY);

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>
          🚀 Fullstack Monorepo Demo
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Next.js frontend with Nest.js backend, PostgreSQL database, and
          GraphQL API
        </p>
      </header>

      {/* GraphQL Connection Status */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
          🔗 API Connection Status
        </h2>
        {loading && <p>🔄 Testing GraphQL connection...</p>}
        {error && (
          <div style={{ color: '#dc3545' }}>
            <p>❌ GraphQL Connection Failed</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Error: {error.message}
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6c757d',
                marginTop: '0.5rem',
              }}
            >
              Make sure the backend server is running on port 3001
            </p>
          </div>
        )}
        {data && (
          <div style={{ color: '#28a745' }}>
            <p>✅ GraphQL API Connected Successfully!</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Server response: {data.hello}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gap: '3rem' }}>
        {/* User Management Section */}
        <section>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>
            👥 User Management
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Create and manage users in your application. All data is stored in
            PostgreSQL and accessed through GraphQL mutations and queries.
          </p>

          {/* Create User Form */}
          <CreateUserForm />

          {/* User List */}
          <UserList />
        </section>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid #eee',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
        }}
      >
        <p>
          Built with Next.js, Nest.js, PostgreSQL, TypeORM, and GraphQL in a
          monorepo setup
        </p>
      </footer>
    </main>
  );
}
