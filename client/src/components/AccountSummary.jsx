import React, { useEffect, useState } from 'react';

const MutualFunds = () => {
  const [balance, setBalance] = useState(52430.75);
  const [transactions, setTransactions] = useState([
    { amount: -1500, label: "Amazon", date: "2025-07-21" },
    { amount: 2200, label: "UPI", date: "2025-07-20" },
    { amount: -300, label: "ATM Withdrawal", date: "2025-07-19" },
  ]);
    const [user, setUser] = useState([]);
    useEffect(() => {

      fetch('http://localhost:5000/api/user')
        .then(res => res.json())
        .then(setUser);
    }, [user]);

    return (

        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-md col-span-1">
                <h2 className="text-xl font-semibold mb-2">💰 Account Summary</h2>
                <p className="text-gray-600">Balance:</p>
                <p className="text-2xl font-bold text-green-600">₹{user?.balance?.toFixed(2)}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">📜 Recent Transactions</h2>
                <ul className="space-y-2">
                    {user?.transactions?.map((txn, i) => (
                        <li key={i} className="flex justify-between border-b pb-1">
                            <span className="text-gray-800">{txn.date} - {txn.label}</span>
                            <span className={`font-semibold ${txn.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{txn.amount}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
};

export default MutualFunds;
