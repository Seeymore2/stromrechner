import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';

describe('Calculator', () => {
  it('renders all input fields', () => {
    render(<Calculator />);
    
    expect(screen.getByLabelText(/annual consumption/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price per kwh/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contract type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('calculates and displays results when calculate is clicked', () => {
    render(<Calculator />);
    
    const consumptionInput = screen.getByLabelText(/annual consumption/i);
    fireEvent.change(consumptionInput, { target: { value: '3500' } });
    
    const priceInput = screen.getByLabelText(/price per kwh/i);
    fireEvent.change(priceInput, { target: { value: '0.35' } });
    
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getByTestId('annual-cost')).toHaveTextContent('1.225,00 EUR');
    expect(screen.getByTestId('monthly-cost')).toHaveTextContent('102,08 EUR');
  });

  it('disables calculate button when consumption is zero', () => {
    render(<Calculator />);
    
    const consumptionInput = screen.getByLabelText(/annual consumption/i);
    fireEvent.change(consumptionInput, { target: { value: '0' } });
    
    expect(screen.getByRole('button', { name: /calculate/i })).toBeDisabled();
  });

  it('disables calculate button when price is zero', () => {
    render(<Calculator />);
    
    const priceInput = screen.getByLabelText(/price per kwh/i);
    fireEvent.change(priceInput, { target: { value: '0' } });
    
    expect(screen.getByRole('button', { name: /calculate/i })).toBeDisabled();
  });

  it('changes results based on contract type', () => {
    render(<Calculator />);
    
    fireEvent.change(screen.getByLabelText(/annual consumption/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/price per kwh/i), { target: { value: '0.35' } });
    
    fireEvent.change(screen.getByLabelText(/contract type/i), { target: { value: 'Green' } });
    
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    
    expect(screen.getByTestId('co2-savings')).toHaveTextContent('350,00 kg');
  });
});