import { render, screen, fireEvent } from '@testing-library/react';
import EnergyInput from './EnergyInput';

describe('EnergyInput', () => {
  it('accepts numeric kWh values', () => {
    render(<EnergyInput />);
    const input = screen.getByLabelText(/annual consumption/i);
    
    fireEvent.change(input, { target: { value: '3500' } });
    expect(input).toHaveValue('3500');
  });

  it('rejects negative values', () => {
    render(<EnergyInput />);
    const input = screen.getByLabelText(/annual consumption/i);
    
    fireEvent.change(input, { target: { value: '-100' } });
    expect(screen.getByText(/must be at least/i)).toBeInTheDocument();
  });

  it('formats German locale numbers with comma as decimal separator', () => {
    const mockOnChange = vi.fn();
    render(<EnergyInput onChange={mockOnChange} />);
    const input = screen.getByLabelText(/annual consumption/i);
    
    fireEvent.change(input, { target: { value: '3500,5' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(3500.5);
  });

  it('handles empty input', () => {
    const mockOnChange = vi.fn();
    render(<EnergyInput onChange={mockOnChange} />);
    const input = screen.getByLabelText(/annual consumption/i);
    
    fireEvent.change(input, { target: { value: '' } });
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it('respects min and max boundaries', () => {
    const mockOnChange = vi.fn();
    render(<EnergyInput onChange={mockOnChange} min={100} max={10000} />);
    const input = screen.getByLabelText(/annual consumption/i);
    
    fireEvent.change(input, { target: { value: '50' } });
    expect(screen.getByText(/must be at least 100/i)).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: '10001' } });
    expect(screen.getByText(/must be at most 10000/i)).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: '5000' } });
    expect(mockOnChange).toHaveBeenCalledWith(5000);
  });

  it('displays error messages', () => {
    render(<EnergyInput />);
    const input = screen.getByLabelText(/annual consumption/i);
    
    fireEvent.change(input, { target: { value: 'invalid' } });
    expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<EnergyInput label="Test Label" />);
    const input = screen.getByLabelText('Test Label');
    
    expect(input).toHaveAttribute('aria-label', 'Test Label');
    expect(input).toHaveAttribute('type', 'text');
  });
});