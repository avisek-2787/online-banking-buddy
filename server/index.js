const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const userProfile = {
  username: "Avisek",
  balance: 52430.75,
  transactions: [
    { amount: -1500, label: "Amazon", date: "7/21/2025" },
    { amount: +2200, label: "UPI", date: "7/20/2025" },
    { amount: -300, label: "ATM Withdrawal", date: "7/08/2025" },
  ],
  creditCardDue: "2025-08-05",
  location: "Salt Lake, Kolkata",
  portfolio: [],
  loans: [],
  deposit: {
    'fd': [],
    'rd': []
  }
};

function detectIntent(message) {
  const text = message.toLowerCase();
  if (text.includes("balance")) return "balance";
  //if (text.includes("transaction") || text.includes("statement")) return "transactions";
  if (text.includes("block") || text.includes("lost") || text.includes("card")) return "block_card";
  if (text.includes("credit card") && text.includes("due")) return "credit_due";
  if (text.includes("loan") || text.includes("eligible")) return "loan_eligibility";
  if (text.includes("branch") || text.includes("nearest")) return "branch_locator";
  if (text.includes("transfer") || text.includes("send money")) return "fund_transfer";
  if (text.includes("mutual") && text.includes("fund")) return "show_mutual";
  if (text.includes("account") || text.includes("summary")) return "account_summary";
  if (text.includes("fd") || text.includes("rd")) return "FD_or_RD";
  if (text.includes("deposit") || text.includes("rd") || text.includes("fd")) return "FD_or_RD_invest";
  if (text.includes("transaction") || text.includes("history")) return "transaction_list";
  return "fallback";
}

function getReply(intent, message) {
  switch (intent) {
    case "balance":
      return `Your account balance is ₹${userProfile.balance.toFixed(2)}.`;

    case "block_card":
      return "Your debit card has been blocked. A new card will be issued within 5 business days.";

    case "credit_due":
      return `Your credit card bill is due on ${userProfile.creditCardDue}.`;

    case "loan_eligibility":
      return "You're eligible for a personal loan up to ₹5,00,000 at 11.5% interest.";

    case "branch_locator":
      return `Nearest branch: SBI, Sector 5, Salt Lake, Kolkata.`;

    case "show_mutual":
      return `show_mutual`;
    case "account_summary":
      return `account_summary`;
    case "FD_or_RD":
      return `FD_or_RD`;
    case "FD_or_RD_invest":
      return `FD_or_RD_invest`;
case "transaction_list":
      return `transaction_list`;
      
    //Transfer ₹1000 to account 1234567890
    case "fund_transfer": {
      const amountMatch = message.match(/(?:₹|rs\.?\s?)(\d+(?:\.\d+)?)/i);
      const accountMatch = message.match(/account\s(\d{9,})/i);

      if (!amountMatch || !accountMatch) {
        return "Please specify the amount and account number (e.g., 'Transfer ₹1000 to account 1234567890')";
      }

      const amount = parseFloat(amountMatch[1]);
      const account = accountMatch[1];

      if (amount > userProfile.balance) {
        return `Insufficient balance. Your current balance is ₹${userProfile.balance.toFixed(2)}.`;
      }

      userProfile.balance -= amount;
      userProfile.transactions.unshift({
        amount: -amount,
        label: `Transfer to ${account}`,
        date: new Date().toISOString().split('T')[0],
      });

      return `Successfully transferred ₹${amount} to account ${account}. Remaining balance: ₹${userProfile.balance.toFixed(2)}.`;
    }

    default:
      return "I'm sorry, I didn't understand. Please try asking something else.";
  }
}

app.post('/api/deposit', (req, res) => {
  const { amount, type, tenure } = req.body;
  const amt = parseFloat(amount);

  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Invalid deposit amount.' });
  }

  if (amt > 500000) {
    return res.status(400).json({ error: 'Maximum deposit limit is ₹5,00,000.' });
  }

  userProfile.balance -= amt;
  userProfile.transactions.unshift({
    label: 'Deposit to '+type,
    amount: -amt,
    date: new Date().toLocaleDateString()
  });
  userProfile.deposit[type].push({ amount, tenure, label:'Deposit to '+type, date: new Date().toLocaleDateString() })
  res.json({ success: true, balance: userProfile.balance, transactions: userProfile.transactions });
});

let deposits = {
  fd: [
    { id: 1, amount: 10000, rate: 6.5, tenure: '12 months', startDate: '2024-07-01' }
  ],
  rd: [
    { id: 1, amount: 2000, rate: 5.8, tenure: '6 months', startDate: '2024-06-01' }
  ]
};

// API endpoints
app.get('/api/fd', (req, res) => {
  res.json(deposits.fd);
});

app.get('/api/rd', (req, res) => {
  res.json(deposits.rd);
});

app.get('/api/myDeposits', (req, res) => {
  res.json(userProfile.deposit);
});


app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  const intent = detectIntent(message);
  const reply = getReply(intent, message);
  res.json({ reply });
});


// ----------------------------
// 📈 Mutual Fund NAV Data
// ----------------------------
const mutualFunds = [
  { name: "SBI Bluechip", nav: 740.23 },
  { name: "HDFC Equity", nav: 903.12 },
  { name: "ICICI Value Discovery", nav: 661.77 },
];

// ----------------------------
// 👤 Route: Get User Info
// ----------------------------
app.get('/api/user', (req, res) => {
  res.json({
    username: userProfile.username,
    balance: userProfile.balance,
    transactions: userProfile.transactions,
    welcomeMessage: `Welcome back, ${userProfile.username}!.`
  });
});

// ----------------------------
// 💸 Route: Fund Transfer
// ----------------------------
app.post('/api/transfer', (req, res) => {
  const { to, amount } = req.body;
  const amt = parseFloat(amount);

  // 🔒 Rules
  if (!to || typeof to !== 'string' || to.trim() === '') {
    return res.status(400).json({ error: 'Recipient is required.' });
  }
  if (to.toLowerCase() === userProfile.username.toLowerCase()) {
    return res.status(400).json({ error: 'Cannot transfer to yourself.' });
  }
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Invalid amount.' });
  }
  if (amt < 100) {
    return res.status(400).json({ error: 'Minimum transfer is ₹100.' });
  }
  if (amt > 100000) {
    return res.status(400).json({ error: 'Maximum transfer limit is ₹1,00,000.' });
  }
  if (amt > userProfile.balance) {
    return res.status(400).json({ error: 'Insufficient balance.' });
  }

  userProfile.balance -= amt;
  userProfile.transactions.unshift({
    label: `Transfer to ${to}`,
    amount: -amt,
    date: new Date().toLocaleDateString()
  });

  res.json({
    success: true,
    balance: userProfile.balance,
    transactions: userProfile.transactions
  });
});

// ----------------------------
// 📊 Route: Get Mutual Funds
// ----------------------------
app.get('/api/mutual-funds', (req, res) => {
  res.json(mutualFunds);
});

// ----------------------------
// 🪙 Route: Invest in Mutual Fund
// ----------------------------
app.post('/api/invest', (req, res) => {
  const { fundName, amount } = req.body;
  const amt = parseFloat(amount);

  if (!fundName || typeof fundName !== 'string') {
    return res.status(400).json({ error: 'Fund name is required.' });
  }
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Invalid investment amount.' });
  }
  if (amt < 1000) {
    return res.status(400).json({ error: 'Minimum investment is ₹1000.' });
  }

  const fund = mutualFunds.find(f =>
    f.name.toLowerCase().includes(fundName.toLowerCase())
  );

  if (!fund) {
    return res.status(404).json({ error: 'Mutual fund not found.' });
  }
  if (amt > userProfile.balance) {
    return res.status(400).json({ error: 'Insufficient balance.' });
  }

  const units = (amt / fund.nav).toFixed(2);

  userProfile.portfolio.push({
    fund: fund.name,
    nav: fund.nav,
    units: parseFloat(units),
    amount: amt
  });

  userProfile.balance -= amt;
  userProfile.transactions.unshift({
    label: `Invested in ${fund.name}`,
    amount: -amt,
    date: new Date().toLocaleDateString()
  });

  res.json({
    message: `Invested ₹${amt} in ${fund.name}`,
    balance: userProfile.balance,
    portfolio: userProfile.portfolio
  });
});

// ----------------------------
// 📂 Route: Portfolio Summary
// ----------------------------
app.get('/api/portfolio', (req, res) => {
  res.json(userProfile.portfolio);
});

app.get('/api/portfolio-chart', (req, res) => {
  const summary = userProfile.portfolio.reduce((acc, item) => {
    const existing = acc.find(entry => entry.name === item.fund);
    if (existing) {
      existing.value += item.amount;
    } else {
      acc.push({ name: item.fund, value: item.amount });
    }
    return acc;
  }, []);

  res.json(summary);
});

app.post('/api/apply-loan', (req, res) => {
  const { amount, reason } = req.body;
  const amt = parseFloat(amount);

  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Invalid loan amount.' });
  }
  if (!reason || typeof reason !== 'string') {
    return res.status(400).json({ error: 'Loan reason is required.' });
  }

  const loan = { id: Date.now(), amount: amt, reason, date: new Date().toLocaleDateString(), status: 'Approved' };
  userProfile.loans.push(loan);
  userProfile.balance += amt;
  userProfile.transactions.unshift({ label: `Loan disbursed for ${reason}`, amount: amt, date: new Date().toLocaleDateString() });

  res.json({ message: 'Loan approved and credited.', loan, balance: user.balance, transactions: userProfile.transactions });
});

app.get('/api/loans', (req, res) => {
  res.json(userProfile.loans);
});


// ----------------------------
// 🔄 Ping/Health Check
// ----------------------------
app.get('/api/ping', (req, res) => {
  res.json({ message: '✅ Backend is active and secure' });
});

app.listen(5000, () => console.log("AI Banking Bot running on http://localhost:5000"));
