import React, { useEffect, useState } from 'react';

const MutualFunds = () => {
  const [funds, setFunds] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selected, setSelected] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/mutual-funds')
      .then(res => res.json())
      .then(setFunds);

    fetch('http://localhost:5000/api/portfolio')
      .then(res => res.json())
      .then(setPortfolio);
  }, []);

  const handleInvest = async () => {
    if (!selected || !amount) return;
    const res = await fetch('http://localhost:5000/api/invest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fundName: selected, amount })
    });
    const data = await res.json();
    alert(data.message || data.error);

    // Refresh portfolio
    const updated = await fetch('http://localhost:5000/api/portfolio').then(r => r.json());
    setPortfolio(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📈 Mutual Funds</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {funds.map((fund, idx) => (
          <div key={idx} className="p-3 border rounded shadow-sm">
            <div className="font-semibold">{fund.name}</div>
            <div>NAV: ₹{fund.nav}</div>
            <button
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setSelected(fund.name)}
            >
              Select
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Invest in {selected}</h3>
          <input
            className="border px-2 py-1 mr-2 rounded"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={handleInvest}
          >
            Invest
          </button>
        </div>
      )}

{portfolio.length>0 && (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">📊 Your Portfolio</h3>
        {portfolio.length === 0 ? (
          <p>No investments yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {portfolio.map((p, i) => (
              <li key={i}>
                {p.fund}: ₹{p.amount} ({p.units} units @ NAV ₹{p.nav})
              </li>
            ))}
          </ul>
        )}
      </div>
      )}
    </div>
  );
};

export default MutualFunds;
