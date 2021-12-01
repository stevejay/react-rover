import { render, screen } from '@testing-library/react';

import App from '@/App';

test('example test', () => {
  render(<App />);
  expect(screen.getByRole('heading')).toHaveTextContent('Hello Vite + React in test!');
});
