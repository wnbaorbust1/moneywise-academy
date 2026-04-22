// Context-aware educational articles per module
// Module indices: 0=scenario, 1=budget, 2=taxes, 3=fin literacy, 4=checks, 5=checkbook, 6=bank acct, 7=credit

export const EDUCATION_HUB = {
  1: {
    title: "Budget Building",
    emoji: "💰",
    articles: [
      {
        id: "50-30-20",
        title: "The 50/30/20 Rule",
        tag: "Core Concept",
        tagColor: "bg-primary/10 text-primary",
        content: `The 50/30/20 rule is the most widely-used budgeting framework. It splits your **after-tax income** into three buckets:

**50% — Needs:** Rent, utilities, groceries, insurance, minimum debt payments. These are non-negotiable.

**30% — Wants:** Dining out, entertainment, subscriptions, hobbies. Nice to have, but cuttable.

**20% — Savings & Debt:** Emergency fund, retirement contributions, extra debt payments.

**Why it works:** It gives you structure without micromanaging every dollar. Start here, then adjust to your life.`,
      },
      {
        id: "fixed-vs-variable",
        title: "Fixed vs. Variable Expenses",
        tag: "Key Distinction",
        tagColor: "bg-chart-3/10 text-chart-3",
        content: `Understanding expense types is crucial to building a realistic budget.

**Fixed expenses** stay the same every month: rent, car payment, insurance, loan minimums. You can predict them exactly.

**Variable expenses** change month to month: groceries, gas, entertainment, clothing. These need to be *estimated* — track them for 2–3 months to find your average.

**Pro tip:** When cutting costs, variable expenses are where you have the most control. Fixed expenses require bigger life changes (moving, selling a car) to reduce.`,
      },
      {
        id: "pay-yourself-first",
        title: "Pay Yourself First",
        tag: "Strategy",
        tagColor: "bg-accent/10 text-accent",
        content: `Most people budget by spending first and saving whatever is left. **This almost never works.**

"Pay yourself first" means automatically moving money into savings *the moment you get paid* — before rent, before groceries, before anything.

**How to do it:** Set up an automatic transfer on payday to a separate savings account. Even $25/paycheck builds the habit.

**The psychology:** You adjust your spending to what remains, not the other way around. It removes willpower from the equation entirely.`,
      },
    ],
  },

  2: {
    title: "Tax Filing",
    emoji: "📋",
    articles: [
      {
        id: "w2-vs-1099",
        title: "W-2 vs. 1099 Income",
        tag: "Core Concept",
        tagColor: "bg-primary/10 text-primary",
        content: `Your tax form tells you a lot about your situation.

**W-2 (Employee):** Your employer withholds taxes from every paycheck — federal, state, Social Security (6.2%), and Medicare (1.45%). You're also covered for unemployment insurance.

**1099 (Self-Employed / Side Hustle):** No taxes are withheld. You receive the full payment, but you owe *all* the taxes yourself — including *both halves* of Social Security and Medicare (15.3% self-employment tax).

**The trap:** Many 1099 workers forget to set aside 25–30% of each payment for taxes and get hit with a huge bill in April.`,
      },
      {
        id: "standard-deduction",
        title: "Standard vs. Itemized Deduction",
        tag: "Tax Savings",
        tagColor: "bg-chart-5/10 text-chart-5",
        content: `A deduction reduces the amount of income the IRS taxes you on.

**Standard deduction (2024):**
- Single: $14,600
- Married Filing Jointly: $29,200
- Head of Household: $21,900

**Itemized deduction:** You add up specific expenses — mortgage interest, state taxes paid, charitable donations, medical bills over 7.5% of income.

**When to itemize:** Only if your itemized total *exceeds* your standard deduction. For most people, especially early in their career, the standard deduction wins.

**Translation:** If you earn $45,000 as a single filer, you're only taxed on $45,000 − $14,600 = $30,400.`,
      },
      {
        id: "tax-brackets",
        title: "How Tax Brackets Actually Work",
        tag: "Common Misconception",
        tagColor: "bg-destructive/10 text-destructive",
        content: `Most people misunderstand tax brackets. A common fear: "If I earn more, I'll take home less because I'll be in a higher bracket." **This is false.**

Tax brackets are **marginal** — only the income *within* each bracket is taxed at that rate.

**Example (2024 Single filer):**
- First $11,600 → taxed at 10%
- $11,601 – $47,150 → taxed at 12%
- $47,151 – $100,525 → taxed at 22%

If you earn $50,000, you don't owe 22% of $50,000. You owe 10% on the first chunk, 12% on the middle chunk, and 22% only on the last $2,850. Your *effective* tax rate will be much lower than your *marginal* rate.`,
      },
    ],
  },

  3: {
    title: "Financial Literacy",
    emoji: "🧠",
    articles: [
      {
        id: "compound-interest",
        title: "The Power of Compound Interest",
        tag: "Core Concept",
        tagColor: "bg-primary/10 text-primary",
        content: `Einstein allegedly called compound interest "the eighth wonder of the world." Here's why.

**Simple interest:** You earn interest only on your original deposit.

**Compound interest:** You earn interest on your deposit *plus* all the interest you've already earned. Your money makes money.

**The Rule of 72:** Divide 72 by your annual interest rate to estimate how many years it takes to double your money.
- At 6%: 72 ÷ 6 = **12 years** to double
- At 9%: 72 ÷ 9 = **8 years** to double

**Start early:** $1,000 invested at age 22 at 8% becomes ~$21,700 by age 65. Wait until 32 to invest that same $1,000 and you only get ~$10,000. Time is the most powerful variable.`,
      },
      {
        id: "emergency-fund",
        title: "Why You Need an Emergency Fund",
        tag: "Foundation",
        tagColor: "bg-chart-3/10 text-chart-3",
        content: `An emergency fund is 3–6 months of essential living expenses kept in a **liquid, low-risk account** (high-yield savings, not investments).

**Why 3–6 months?**
- Job loss typically takes 2–5 months to resolve
- Car repairs, medical bills, and home emergencies are not optional

**Without it:** You rely on credit cards (18–29% APR) or personal loans. A $1,500 car repair becomes a $2,000 debt that takes a year to pay off.

**With it:** The same $1,500 repair costs exactly $1,500. You rebuild the fund over the next 2–3 months. No debt, no stress spiral.

**Start small:** Even $500–$1,000 prevents most financial emergencies from becoming disasters.`,
      },
      {
        id: "credit-score",
        title: "What Makes Up Your Credit Score",
        tag: "Credit Basics",
        tagColor: "bg-chart-4/10 text-chart-4",
        content: `Your FICO score (300–850) controls your access to loans, apartments, and even some jobs. It's calculated from five factors:

| Factor | Weight |
|--------|--------|
| Payment History | 35% |
| Amounts Owed (Utilization) | 30% |
| Length of Credit History | 15% |
| New Credit (Inquiries) | 10% |
| Credit Mix | 10% |

**The two biggest levers:**
1. **Pay on time, every time.** One 30-day late payment can drop your score by 50–100 points.
2. **Keep utilization under 30%.** If your card limit is $1,000, keep your balance below $300. Under 10% is ideal.

**Myth:** Checking your own credit hurts your score. **False.** Soft inquiries (you checking) don't affect your score. Only hard inquiries (lenders checking) do.`,
      },
    ],
  },

  4: {
    title: "Writing Checks",
    emoji: "✏️",
    articles: [
      {
        id: "anatomy-of-a-check",
        title: "Anatomy of a Check",
        tag: "Reference",
        tagColor: "bg-primary/10 text-primary",
        content: `Every field on a check has a legal purpose. Filling any field incorrectly can void the check or enable fraud.

**Date line:** Write the full date (e.g., April 22, 2026). You can post-date a check but the recipient can cash it early.

**Pay to the order of:** The full legal name of the person or business. "Cash" makes it payable to anyone who holds it — risky!

**Numeric amount box:** Write the dollar amount in numbers as close to the left edge as possible (e.g., $247.85). Leave no space for alterations.

**Written amount line:** Write the dollars in words, then fractions for cents: *"Two hundred forty-seven and 85/100"*. Draw a line through remaining space.

**Memo line:** Optional, but useful for your records ("August Rent," "Invoice #104").

**Signature:** Without your signature, the check is legally invalid.`,
      },
      {
        id: "check-safety",
        title: "Check Safety & Fraud Prevention",
        tag: "Security",
        tagColor: "bg-destructive/10 text-destructive",
        content: `Checks contain sensitive information — your routing number, account number, and signature. Here's how to protect yourself.

**Never:**
- Leave blank spaces in the amount fields (draw a line through unused space)
- Make checks payable to "Cash" unless you're at the bank
- Mail checks with a visible window envelope (accounts can be extracted)
- Leave pre-signed blank checks anywhere

**Always:**
- Use a pen (not pencil) — ballpoint is hardest to wash
- Keep a register of every check you write with date, payee, and amount
- Report lost or stolen checks to your bank immediately (stop payment request)
- Shred cancelled/void checks, not just throw them away

**Check washing:** Criminals can chemically erase ink and rewrite payee and amounts. Gel ink pens are the most resistant to this attack.`,
      },
    ],
  },

  5: {
    title: "Checkbook Balancing",
    emoji: "📒",
    articles: [
      {
        id: "why-balance",
        title: "Why Balance Your Checkbook?",
        tag: "Core Habit",
        tagColor: "bg-primary/10 text-primary",
        content: `Your bank balance on the app is **not your real balance.** It doesn't include:
- Checks you've written that haven't been cashed yet
- Automatic payments that haven't hit yet
- Transactions that are still pending

**If you spend based on the displayed balance**, you can overdraft — even while thinking you have money.

**Balancing your checkbook** means maintaining your own running record of every transaction so your *personal ledger* is always current, regardless of what the bank shows.

**Modern equivalent:** Use a banking app's transaction export or a spreadsheet. The principle is the same — your own record is more accurate than the bank's real-time display because you know about checks in transit.`,
      },
      {
        id: "running-balance",
        title: "Calculating a Running Balance",
        tag: "Formula",
        tagColor: "bg-chart-3/10 text-chart-3",
        content: `The core formula for every checkbook entry:

> **Previous Balance ± Transaction = New Balance**

**For deposits (money IN):** Previous Balance **+** Deposit Amount = New Balance
**For checks/debits (money OUT):** Previous Balance **−** Payment Amount = New Balance

**Tips for accuracy:**
- Always start from a known correct balance (your last bank statement)
- Enter every transaction immediately — don't rely on memory
- Use a consistent format: date, description, debit/credit, balance
- Double-check: add up all debits and credits separately, then verify the math

**Reconciling:** Once a month, compare your ledger against your bank statement. All cleared transactions should match. Any discrepancy needs investigation.`,
      },
      {
        id: "overdraft",
        title: "Understanding Overdraft Fees",
        tag: "Watch Out",
        tagColor: "bg-destructive/10 text-destructive",
        content: `An overdraft occurs when you spend more than your account balance. Banks typically charge **$25–$35 per transaction** — even for a $2 coffee that overdrafts you by $0.50.

**Overdraft protection options:**
1. **Link to savings:** Bank auto-transfers from savings to cover overdraws. Usually free or a small fee.
2. **Overdraft line of credit:** Bank covers it as a loan. Interest applies.
3. **Opt out entirely:** Transaction is declined. No fee, but potentially embarrassing at the register.

**The real cost:** One month of poor bookkeeping with 5 overdraft transactions = **$150–$175 in fees**. That's a car payment.

**Best practice:** Keep a $100–$200 "buffer" in checking at all times — money you mentally treat as $0 — so math errors don't cost you fees.`,
      },
    ],
  },

  6: {
    title: "Opening a Bank Account",
    emoji: "🏦",
    articles: [
      {
        id: "checking-vs-savings",
        title: "Checking vs. Savings Accounts",
        tag: "Core Concept",
        tagColor: "bg-primary/10 text-primary",
        content: `These two accounts serve completely different purposes.

**Checking account:** Your daily spending account. Linked to your debit card, used for bill payments and direct deposit. Usually earns 0–0.01% interest. No limits on withdrawals.

**Savings account:** For money you want to keep separate and grow. Higher interest rate (high-yield savings accounts can offer 4–5% APY). Traditionally limited to 6 withdrawals/month.

**The strategy:** Direct deposit goes to checking → Automatic transfer to savings on payday → Spend only from checking. This separates your "operating budget" from your "future money."

**High-Yield Savings Accounts (HYSAs):** Online banks like Marcus, Ally, and SoFi often offer 10–50x higher interest than traditional banks with no monthly fees.`,
      },
      {
        id: "fees-to-avoid",
        title: "Bank Fees to Always Avoid",
        tag: "Money Saver",
        tagColor: "bg-chart-5/10 text-chart-5",
        content: `Banks make billions from fees. Know what to watch for:

**Monthly maintenance fees ($8–$25/mo):** Waived if you maintain a minimum balance or have direct deposit. Always ask for this requirement before opening an account.

**ATM fees ($2–$5/transaction):** Use your bank's ATMs or choose a bank that reimburses out-of-network ATM fees (many online banks do this).

**Overdraft fees ($25–$35/transaction):** See the overdraft article for prevention strategies.

**Minimum balance fees:** Charged when your balance drops below a threshold (e.g., $300). Either maintain the minimum or choose an account with no minimum.

**Wire transfer fees ($15–$35):** Use services like Zelle, Venmo, or ACH transfers instead when possible.

**Total avoidable:** A person paying all of these could waste **$600–$1,200/year** in unnecessary bank fees.`,
      },
      {
        id: "routing-account-numbers",
        title: "Routing vs. Account Numbers",
        tag: "Basics",
        tagColor: "bg-chart-3/10 text-chart-3",
        content: `You'll see both numbers on the bottom of every check, and you'll need them for direct deposit, bill pay, and wire transfers.

**Routing number (9 digits):** Identifies your *bank* — like a bank's address. All customers at the same bank share the same routing number (sometimes different per state).

**Account number (8–17 digits):** Identifies *your specific account* at that bank. Unique to you.

**On a check (left to right):** Routing number → Account number → Check number

**When to share them:**
- Setting up direct deposit with an employer ✓
- Paying bills via ACH bank transfer ✓
- Sharing with untrusted sources ✗ — account numbers + routing numbers are enough to initiate a withdrawal

**Security tip:** Anyone with both numbers can potentially debit your account. Treat them like a password.`,
      },
    ],
  },

  7: {
    title: "Credit Application",
    emoji: "💳",
    articles: [
      {
        id: "apr-explained",
        title: "APR: The True Cost of Credit",
        tag: "Core Concept",
        tagColor: "bg-primary/10 text-primary",
        content: `APR (Annual Percentage Rate) is the yearly cost of borrowing money, expressed as a percentage. It's the number that reveals whether a credit product is a good deal.

**Average APR by card type (2024):**
- Rewards cards: 22–28%
- Store cards: 28–32%
- Student cards: 19–25%
- Balance transfer cards: 0% intro, then 18–24%

**The math that hurts:** If you carry a $2,000 balance at 24% APR:
- Monthly interest: 24% ÷ 12 = 2% → $40/month just in interest
- If you only pay the minimum, you could pay $2,000+ in interest before clearing the balance

**The golden rule:** If you can't pay the balance in full each month, the interest will always cost more than any rewards you earn.`,
      },
      {
        id: "credit-utilization",
        title: "Credit Utilization — The 30% Rule",
        tag: "Credit Score Impact",
        tagColor: "bg-chart-4/10 text-chart-4",
        content: `Credit utilization is the ratio of your credit card balance to your credit limit. It makes up **30% of your FICO score** — the second biggest factor.

**Formula:** (Total Balances ÷ Total Credit Limits) × 100

**Example:**
- Card A: $400 balance / $1,000 limit = 40% utilization
- Card B: $100 balance / $2,000 limit = 5% utilization
- Combined: $500 / $3,000 = **16.7% utilization** ✓

**Thresholds:**
- Under 30%: Good
- Under 10%: Excellent (this is where the best score improvements happen)
- Over 50%: Hurts your score significantly

**Trick:** You can pay your bill *before* the statement closes to lower the reported balance — even if you pay in full every month.`,
      },
      {
        id: "good-debt-vs-bad",
        title: "Good Debt vs. Bad Debt",
        tag: "Philosophy",
        tagColor: "bg-accent/10 text-accent",
        content: `Not all debt is equal. Understanding this distinction is one of the most important financial mindset shifts.

**Good debt** has a low interest rate and finances something that grows in value or increases your earning power:
- Mortgage (home appreciates, builds equity)
- Student loans (college degree increases lifetime earnings — when chosen wisely)
- Small business loan (capital to generate more revenue)

**Bad debt** has a high interest rate and finances things that lose value or are already consumed:
- Credit card balances carried month-to-month (18–30% APR)
- Payday loans (often 300–400% effective APR)
- Car loans for depreciating luxury vehicles you can't afford

**The rule:** If the interest rate is lower than the expected return on your money elsewhere (e.g., market returns of ~7–10%), carrying the debt can make sense. If it's higher, pay it off aggressively.`,
      },
    ],
  },
};

export function getModuleArticles(moduleIndex) {
  return EDUCATION_HUB[moduleIndex] || null;
}