import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  type: 'course' | 'resource' | 'template';
  quantity: number;
}

interface CheckoutProps {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  onPlaceOrder?: (orderDetails: {
    billingInfo: BillingInfo;
    paymentInfo: PaymentInfo;
  }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  onBack?: () => void;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

const Checkout: React.FC<CheckoutProps> = ({
  items,
  subtotal,
  discount,
  onPlaceOrder,
  onBack
}) => {
  const [step, setStep] = useState<'billing' | 'payment' | 'confirmation'>('billing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const total = subtotal - discount;

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (Object.values(billingInfo).some(value => !value.trim())) {
      setError('Please fill in all billing information');
      return;
    }
    setError(null);
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (Object.values(paymentInfo).some(value => !value.trim())) {
      setError('Please fill in all payment information');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await onPlaceOrder?.({
        billingInfo,
        paymentInfo
      });

      if (result?.success) {
        setOrderId(result.orderId || null);
        setStep('confirmation');
      } else {
        setError(result?.error || 'Failed to process payment');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOrderSummary = () => (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Order Summary</h3>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-start">
            <div>
              <div className="font-medium">{item.title}</div>
              <Badge variant="secondary">{item.type}</Badge>
              <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
            </div>
            <div className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderBillingForm = () => (
    <form onSubmit={handleBillingSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={billingInfo.firstName}
          onChange={e => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
        />
        <Input
          label="Last Name"
          value={billingInfo.lastName}
          onChange={e => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={billingInfo.email}
          onChange={e => setBillingInfo({ ...billingInfo, email: e.target.value })}
        />
        <Input
          label="Phone"
          type="tel"
          value={billingInfo.phone}
          onChange={e => setBillingInfo({ ...billingInfo, phone: e.target.value })}
        />
        <Input
          label="Address"
          value={billingInfo.address}
          onChange={e => setBillingInfo({ ...billingInfo, address: e.target.value })}
          className="md:col-span-2"
        />
        <Input
          label="City"
          value={billingInfo.city}
          onChange={e => setBillingInfo({ ...billingInfo, city: e.target.value })}
        />
        <Input
          label="State/Province"
          value={billingInfo.state}
          onChange={e => setBillingInfo({ ...billingInfo, state: e.target.value })}
        />
        <Input
          label="ZIP/Postal Code"
          value={billingInfo.zipCode}
          onChange={e => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
        />
        <Input
          label="Country"
          value={billingInfo.country}
          onChange={e => setBillingInfo({ ...billingInfo, country: e.target.value })}
        />
      </div>
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      <div className="flex justify-between">
        <Button onClick={onBack} variant="secondary">
          Back to Cart
        </Button>
        <Button type="submit" variant="primary">
          Continue to Payment
        </Button>
      </div>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Card Number"
          value={paymentInfo.cardNumber}
          onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
          placeholder="1234 5678 9012 3456"
        />
        <Input
          label="Card Holder Name"
          value={paymentInfo.cardHolder}
          onChange={e => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
        />
        <div className="grid grid-cols-4 gap-4">
          <Select
            label="Month"
            value={paymentInfo.expiryMonth}
            onChange={e => setPaymentInfo({ ...paymentInfo, expiryMonth: e.target.value })}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1).padStart(2, '0'),
              label: String(i + 1).padStart(2, '0')
            }))}
            className="col-span-1"
          />
          <Select
            label="Year"
            value={paymentInfo.expiryYear}
            onChange={e => setPaymentInfo({ ...paymentInfo, expiryYear: e.target.value })}
            options={Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return { value: String(year), label: String(year) };
            })}
            className="col-span-1"
          />
          <Input
            label="CVV"
            value={paymentInfo.cvv}
            onChange={e => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
            type="password"
            maxLength={4}
            className="col-span-2"
          />
        </div>
      </div>
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      <div className="flex justify-between">
        <Button onClick={() => setStep('billing')} variant="secondary">
          Back to Billing
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <LoadingSpinner className="mr-2" />
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </form>
  );

  const renderConfirmation = () => (
    <div className="text-center py-8">
      <div className="text-green-500 text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-4">
        Thank you for your purchase. Your order number is:
      </p>
      <p className="text-xl font-mono bg-gray-100 p-2 rounded inline-block mb-8">
        {orderId}
      </p>
      <div>
        <Button onClick={onBack} variant="primary">
          Return to Store
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {step === 'billing' && renderBillingForm()}
          {step === 'payment' && renderPaymentForm()}
          {step === 'confirmation' && renderConfirmation()}
        </div>
        <div className="md:col-span-1">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
