# OSINT Investigations Book Landing Page

A Next.js web application for selling the OSINT Investigations book with integrated Stripe payment processing and SUI cryptocurrency conversion.

## Features

- 🎨 Modern, responsive landing page
- 💳 Stripe checkout integration for card payments
- 🪙 Automatic SUI cryptocurrency purchase on backend
- 📥 Instant PDF download after purchase
- ⚡ Optimized for Vercel deployment

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Then fill in your actual values:

- **Stripe Keys**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Stripe Webhook Secret**: Get from [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- **SUI Wallet Address**: Your SUI wallet address where funds will be sent

### 3. Set up Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Copy the webhook signing secret to your `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Configure Environment Variables in Vercel

In your Vercel project settings, add all environment variables from `.env.local`:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUI_RPC_URL`
- `SUI_DESTINATION_WALLET`

### 4. Update Stripe Webhook URL

After deployment, update your Stripe webhook endpoint URL to point to your production domain:
`https://yourdomain.vercel.app/api/webhook`

## SUI Purchase Implementation

The current implementation in `lib/sui-purchase.ts` is a foundation that logs the transaction. To complete the SUI purchase functionality, you need to:

1. **Choose an Exchange or DEX**:
   - Centralized: Coinbase Commerce, Kraken, Binance API
   - Decentralized: Use a DEX aggregator like 1inch or integrate directly with SUI DEXs

2. **Implement the Exchange Integration**:
   - Add exchange API credentials to environment variables
   - Implement `buyFromExchange()` function to purchase SUI
   - Implement `sendSuiToWallet()` to transfer to your wallet

3. **Example Flow**:
   ```typescript
   // In lib/sui-purchase.ts
   const suiAmount = await buyFromExchange(amountInUsd);
   await sendSuiToWallet(suiAmount, destinationWallet);
   ```

4. **Security Considerations**:
   - Use a hot wallet with limited funds for automated transfers
   - Implement rate limiting and fraud detection
   - Store transaction records in a database
   - Set up monitoring and alerts

## File Structure

```
osint-book-landing/
├── app/
│   ├── api/
│   │   ├── create-checkout-session/
│   │   │   └── route.ts          # Stripe checkout session creation
│   │   └── webhook/
│   │       └── route.ts          # Stripe webhook handler
│   ├── success/
│   │   └── page.tsx             # Post-purchase success page
│   └── page.tsx                 # Landing page
├── lib/
│   └── sui-purchase.ts          # SUI purchase logic
├── public/
│   └── OSINT-INVESTIGATIONS.pdf # Your book PDF
├── .env.local.example           # Environment variables template
└── vercel.json                  # Vercel configuration
```

## Testing

### Test Stripe Integration

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Use any future expiry date and any 3-digit CVC.

### Test Webhook Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Support

For issues or questions, please open an issue on GitHub or contact support.

## License

All rights reserved.
