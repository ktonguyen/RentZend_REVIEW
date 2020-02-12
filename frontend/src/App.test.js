import React from 'react';
import { render } from '@testing-library/react';
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  wait,
} from '@testing-library/dom'
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('Simple testing', async () => {
  const textValue = 'Tran Nguyen'
  const container = App()

  const input = getByLabelText(container, 'name');
  input.value = textValue

  expect(getByLabelText(container, 'name').value).toBe(
    textValue
  )
  expect(container).toMatchSnapshot()
})