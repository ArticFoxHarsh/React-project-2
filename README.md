# 💰 Finance Tracker

A modern, feature-rich **Personal Finance & Expense Analytics Dashboard** built with React 19 and Vite.  
Track income, expenses, budgets, and spending trends — all from a clean, responsive interface with interactive charts and local data persistence.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | At-a-glance summary cards for income, expenses, and balance with a personalised greeting |
| **Transactions** | Full CRUD — add, edit, and delete transactions with title, amount, category, type, date & notes |
| **Search & Filter** | Real-time search with debounce, category / type filters, date-range picker, and multi-column sorting |
| **Budget Tracking** | Set a monthly budget and monitor spending with a visual progress bar |
| **Analytics** | Dedicated insights page with line charts (monthly trends), pie charts (category breakdown), and bar charts (income vs expense) |
| **Profile** | Update your display name and avatar via a modal — stored locally |
| **Recurring Transactions** | Flag transactions as recurring for better tracking |
| **Toast Notifications** | Non-intrusive success / info / warning toasts for every action |
| **Dark-friendly Palette** | Carefully tuned color tokens for a polished, modern UI |
| **Data Persistence** | All data lives in `localStorage` — zero backend required |
| **Currency Exchange API** | Fetches live USD exchange rates via ExchangeRate-API |

---

## 🛠️ Tech Stack

- **Framework:** React 19 (with Hooks, Context API & `useReducer`)
- **Build Tool:** Vite 8
- **Routing:** React Router DOM v7
- **Forms & Validation:** React Hook Form + Yup resolvers
- **Charts:** Recharts (Line, Bar, Pie)
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Dates:** date-fns
- **Unique IDs:** uuid
- **Notifications:** React Toastify
- **Icons:** React Icons
- **Linting:** ESLint 9

---

## 📂 Project Structure

```
React-project-2/
├── public/                  # Static assets & favicon
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BudgetCard/      #   Budget progress card (JSX + CSS)
│   │   ├── Topbar.jsx       #   Navigation bar
│   │   └── ProfileModal.jsx #   Profile edit modal
│   ├── context/
│   │   └── FinanceContext.jsx  # Global state (transactions, budget, user, filters)
│   ├── hooks/
│   │   ├── useBudget.js        # Budget helper hook
│   │   ├── useDebounce.js      # Debounced search hook
│   │   └── useTransactions.js  # Transaction data hook
│   ├── pages/
│   │   ├── Dashboard.jsx    # Home page with summary & charts
│   │   ├── Transactions.jsx # Full transaction list with filters
│   │   ├── AddTransaction.jsx # New transaction form
│   │   ├── Budget.jsx       # Monthly budget management
│   │   └── Analytics.jsx    # Deep-dive financial insights
│   ├── services/
│   │   └── api.js           # External API calls (currency rates, news)
│   ├── utils/
│   │   ├── formatters.js    # Currency & date formatting helpers
│   │   └── validation.js    # Yup validation schemas
│   ├── App.jsx              # Route definitions
│   ├── main.jsx             # Entry point — providers & router setup
│   └── index.css            # Global styles & design tokens
├── index.html               # HTML shell
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ArticFoxHarsh/React-project-2.git
cd React-project-2

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### Other Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Create optimised production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 📖 Usage

1. **Add a transaction** — Navigate to *Transactions → New* and fill in the form.
2. **Set your budget** — Head to the *Budget* page and enter your monthly limit.
3. **Explore insights** — Visit *Analytics* for detailed charts and trends.
4. **Customise your profile** — Click your avatar in the top bar to update your name or photo.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
