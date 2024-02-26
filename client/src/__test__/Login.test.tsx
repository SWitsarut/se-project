import { describe, expect, test } from '@jest/globals';
import { render, screen, cleanup, fireEvent, userEvent } from '../__test-utils';
import LoginForm from '../app/(user)/(auth)/login/LoginForm';
import { setRouterMounted } from '../__mocks__/next/navigation';

afterEach(() => {
  cleanup();
});

jest.mock('next/navigation');

describe('LoginForm', () => {
  beforeEach(() => {
    setRouterMounted(true); // Set router as mounted before each test
  });
  it('should call router.push when button is clicked', () => {
    render(<LoginForm />);
    // fireEvent.click(getByText('Go to some page'));
    // expect(require('next/router').useRouter().push).toHaveBeenCalledWith('/some-page');
  });
});