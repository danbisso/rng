import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Yes or no text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Yes or no/i);
  expect(linkElement).toBeInTheDocument();
});
