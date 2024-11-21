import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

interface CartItem {
  id: string;
  title: string;
  price: number;
  type: 'course' | 'resource' | 'template';
  thumbnail?: string;
  author: {
    name: string;
  };
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onApplyCoupon?: (code: string) => Promise<{ valid: boolean; discount: number }>;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onCheckout,
  onContinueShopping
}) => {
  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [discount, setDiscount] = React.useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      onUpdateQuantity?.(itemId, newQuantity);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const result = await onApplyCoupon?.(couponCode);
      if (result?.valid) {
        setDiscount(result.discount);
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch (error) {
      setCouponError('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button onClick={onContinueShopping} variant="primary">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shopping Cart</h2>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-4">
              {/* Item Image */}
              <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">by {item.author.name}</p>
                    <Badge variant="secondary" className="mt-1">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      variant="secondary"
                      size="sm"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      variant="secondary"
                      size="sm"
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    onClick={() => onRemoveItem?.(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Coupon and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Apply Coupon</h3>
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-grow"
            />
            <Button
              onClick={handleApplyCoupon}
              variant="secondary"
              disabled={isApplyingCoupon}
            >
              Apply
            </Button>
          </div>
          {couponError && (
            <Alert variant="error" className="mt-2">
              {couponError}
            </Alert>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Order Summary</h3>
          <div className="space-y-2">
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
            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Button onClick={onCheckout} variant="primary" className="w-full">
              Proceed to Checkout
            </Button>
            <Button onClick={onContinueShopping} variant="secondary" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
