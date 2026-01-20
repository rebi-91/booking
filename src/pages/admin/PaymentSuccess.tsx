import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, Clock } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    }
  }, [sessionId]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/checkout-session/${sessionId}`);
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been successfully processed.</p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{orderDetails.metadata?.orderId || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email Sent To</p>
                  <p className="font-medium">{orderDetails.customer_email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(orderDetails.created).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    £{orderDetails.amount_total?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Print Receipt
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent. You'll receive shipping updates shortly.
              Need help? Contact support@techstore.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;