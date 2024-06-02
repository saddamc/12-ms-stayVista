// This example shows you how to set up React Stripe.js and use Elements.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web


import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import './CheckoutForm.css';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import PropTypes from 'prop-types'


const CheckoutForm = ({closeModal, bookingInfo}) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure()
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, seCardError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // fetch client secret
    if(bookingInfo?.price && bookingInfo?.price > 1){
        getClientSecret({price: bookingInfo?.price})
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingInfo?.price])

//   get clientSecret
const getClientSecret = async price => {
    const {data} = await axiosSecure.post('/create-payment-intent', price)
    console.log('client secret from server', data)
    setClientSecret(data.clientSecret)
}


  const handleSubmit = async event => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
        <div className='flex mt-2 justify-around'>
            <button
                disabled={!stripe || !clientSecret || processing }
                type='submit'
                className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    
                >
                    Pay ${bookingInfo?.price}
                </button>
                <button
                onClick={closeModal}

                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                >
                    Cancel
            </button>
            
        </div>
    </form>
  );
};


CheckoutForm.propTypes = {
    bookingInfo: PropTypes.object,
    closeModal: PropTypes.func,
  }

export default CheckoutForm;

