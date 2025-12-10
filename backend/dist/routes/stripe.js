import express from 'express';
import Stripe from 'stripe';
const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }) : null;
router.post('/checkout', async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (!stripe) {
            return res.json({
                url: 'https://buy.stripe.com/test_demo',
                message: 'Stripe not configured - demo mode'
            });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'NeuroPrep AI Pro',
                            description: 'Unlimited interview sessions + advanced analytics'
                        },
                        unit_amount: 2900,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${process.env.CORS_ORIGIN}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CORS_ORIGIN}/pricing`,
            customer_email: email,
            metadata: { userId }
        });
        res.json({ url: session.url });
    }
    catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: error.message });
    }
});
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!stripe || !sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.sendStatus(400);
    }
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Payment successful:', session.metadata?.userId);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});
export default router;
