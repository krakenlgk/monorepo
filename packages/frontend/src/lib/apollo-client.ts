import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create HTTP link to the GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
  credentials: 'include', // Include cookies for authentication
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      // Add type policies for better caching if needed
      Query: {
        fields: {
          // Example: Configure field policies for pagination
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
  // Enable dev tools in development
  connectToDevTools: process.env.NODE_ENV === 'development',
});