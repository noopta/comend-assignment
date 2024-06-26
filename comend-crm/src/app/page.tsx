// page.tsx
import React from 'react';
import Landing from '../components/Landing';
import Dashboard from '../components/Dashboard';
import SignInForm from '../components/SignInForm';
import { ProfileForm } from '../components/ProfileForm';
import { AuthProvider } from '../app/context/AuthProvider';

export default function Page() {
  return (
    <AuthProvider>
      <Landing />
    </AuthProvider>
  );
}