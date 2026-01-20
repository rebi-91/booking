import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ShoppingCart } from 'lucide-react';

const CheckoutCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Cancelled</h1>
          <p className="text-gray-600 mb-8">
            Your order was not completed. No charges have been made to your account.
            You can try again or contact us if you need assistance.
          </p>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Return to Store
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at support@techstore.com
              or call +44 20 7946 0958
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;