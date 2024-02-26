import { describe, expect, test } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import loginSubmit from '@/app/(user)/(auth)/login/LoginForm';
  