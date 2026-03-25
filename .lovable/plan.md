

## Email Notifications for Deposits, Withdrawals, and Investment Maturity

### Overview
Set up Lovable's built-in email system to send users notifications when:
1. Their deposit is approved/rejected by admin
2. Their withdrawal is approved/rejected by admin
3. Their investment ROI is paid out or investment completes

### Prerequisites — Email Domain Setup
No email domain is configured yet. The first step is setting up a sender domain so emails can be sent from your brand (e.g., `notify@yourdomain.com`). This improves deliverability and trust.

### Plan

**Step 1: Set up email domain**
- Open the email domain setup dialog for you to configure your sender domain

**Step 2: Set up email infrastructure**
- Create the database tables, queues, and background jobs needed for reliable email delivery

**Step 3: Scaffold transactional email system**
- Create the email sending Edge Function and unsubscribe handling

**Step 4: Create 4 email templates**
- `deposit-status` — "Your deposit of $X has been approved/rejected"
- `withdrawal-status` — "Your withdrawal of $X has been approved/rejected"
- `roi-payout` — "You received $X ROI from your [Plan Name] investment"
- `investment-completed` — "Your [Plan Name] investment has matured, principal returned"

All templates will be styled to match your app's brand colors and design.

**Step 5: Wire up triggers**

*Admin deposit/withdrawal approval:*
- In `AdminDeposits.tsx`, after the admin approves/rejects a deposit, call the send-transactional-email function with the user's email, amount, and status
- In `AdminWithdrawals.tsx`, same pattern for withdrawal approval/rejection
- Need to fetch the user's email from auth or profiles when sending

*ROI payouts and investment completion:*
- In `process-roi-payouts` Edge Function, after inserting ROI transactions and after completing investments, call `send-transactional-email` internally with the user's email

**Step 6: Create unsubscribe page**
- Add a branded unsubscribe page at the path chosen by the scaffold tool

**Step 7: Deploy all Edge Functions**

### Technical Details

- Email sending uses a durable queue with automatic retries — no emails are lost
- Each notification includes an idempotency key (e.g., `deposit-approved-{deposit_id}`) to prevent duplicate sends
- The ROI payout Edge Function will need to look up user emails via `auth.users` (using service role)
- Admin pages will need to fetch the user's email before sending, either from a join or a separate query
- All templates use React Email components with inline styles matching the app's theme

