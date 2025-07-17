'use client';

import { useQuery, gql } from '@apollo/client';

const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(HELLO_QUERY);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to Monorepo Frontend</h1>
      <p>This is a Next.js application running in a monorepo setup.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>GraphQL Connection Test</h2>
        {loading && <p>Loading GraphQL data...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {data && (
          <div>
            <p style={{ color: 'green' }}>✅ GraphQL Connected Successfully!</p>
            <p>Response: {data.hello}</p>
          </div>
        )}
      </div>
    </main>
  )
}