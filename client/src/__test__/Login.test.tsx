import { describe, expect, test } from '@jest/globals';
import { render, screen, cleanup, fireEvent, renderHook } from '../__test-utils';
import LoginForm from '../app/(user)/(auth)/login/LoginForm';
import { useRouter } from 'next/navigation';

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

test('router is called', () => {
  const mockRouter = {
    push: jest.fn()
  }
  
  render(<LoginForm />);  
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  
  expect(mockRouter.push).toHaveBeenCalledWith("/");
});