let isMounted = false;

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),

  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  isReady: true,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isPreview: false,
  basePath: '',
  locale: '',
  locales: [],
  defaultLocale: '',
  isMounted: () => isMounted,
}));

export const setRouterMounted = (value) => {
  isMounted = value;
};