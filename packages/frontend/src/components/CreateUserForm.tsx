'use client';

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

interface CreateUserFormProps {
  onUserCreated?: () => void;
}

export default function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    bio: ''
  });

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    onCompleted: () => {
      // Reset form after successful creation
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        bio: ''
      });
      onUserCreated?.();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName) {
      return;
    }

    try {
      await createUser({
        variables: {
          input: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            bio: formData.bio || undefined
          }
        }
      });
    } catch (err) {
      // Error is handled by Apollo Client and displayed in the UI
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box' as const
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333'
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Create New User</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="firstName" style={labelStyle}>
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter first name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="lastName" style={labelStyle}>
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter last name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={labelStyle}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter email address"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="bio" style={labelStyle}>
            Bio (optional)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical' as const,
              minHeight: '80px'
            }}
            placeholder="Tell us about yourself..."
          />
        </div>

        {error && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            border: '1px solid #f5c6cb', 
            borderRadius: '4px' 
          }}>
            Error creating user: {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.email || !formData.firstName || !formData.lastName}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating User...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}