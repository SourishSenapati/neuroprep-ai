import { useState } from 'react';

export const useRazorpay = () => {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-sdk')) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.id = 'razorpay-sdk';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (userId: string, onSuccess?: () => void) => {
        setLoading(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert('Failed to load payment gateway');
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            // Create Order
            const res = await fetch(`${apiUrl}/api/payment/create-order`, {
                method: 'POST',
            });
            const order = await res.json();

            if (!order) return;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RuBymTWufgW3fT', 
                amount: order.amount,
                currency: order.currency,
                name: "NeuroPrep AI",
                description: "Pro Subscription",
                order_id: order.id,
                handler: async function (response: any) {
                    // Verify Payment
                    const verifyRes = await fetch(`${apiUrl}/api/payment/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert('Payment Successful! You are now a Pro member.');
                        if (onSuccess) onSuccess();
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4ADE80"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error(error);
            alert('Payment execution failed');
        } finally {
            setLoading(false);
        }
    };

    return { handlePayment, loading };
};
