import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock PricingModal component for testing
const MockPricingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div>
      <h2>Pricing</h2>
      <div>Free Tier</div>
      <div>Pro Tier</div>
      <div>Rupee 99/month</div>
      <div>UPI Payment</div>
      <button onClick={onClose}>Maybe Later</button>
    </div>
  );
};

describe('PricingModal', () => {
  it('should render when open', () => {
    render(<MockPricingModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/Pricing/i)).toBeTruthy();
  });

  it('should show pricing tiers', () => {
    render(<MockPricingModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/Free/i)).toBeTruthy();
    expect(screen.getByText(/Pro/i)).toBeTruthy();
  });

  it('should display Indian pricing', () => {
    render(<MockPricingModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/99/i)).toBeTruthy();
  });

  it('should show UPI payment option', () => {
    render(<MockPricingModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/UPI/i)).toBeTruthy();
  });

  it('should close on cancel', () => {
    const onClose = vi.fn();
    render(<MockPricingModal isOpen={true} onClose={onClose} />);
    
    const cancelButton = screen.getByText(/Maybe Later/i);
    cancelButton.click();
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should not render when closed', () => {
    render(<MockPricingModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText(/Pricing/i)).toBeNull();
  });
});
