import React, { useEffect, useState } from 'react';

const TransactionFilter = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/user')
      .then(res => res.json())
      .then(data => {
        setTransactions(data.transactions);
        setFiltered(data.transactions);
      });
  }, []);

  const filterByDate = () => {
    if (!fromDate || !toDate) {
      setFiltered(transactions);
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const result = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= from && txDate <= to;
    });

    setFiltered(result);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Transaction History</h2>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={filterByDate}
          className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No transactions found for selected dates.</p>
      ) : (
        <table className="w-full table-auto border">
            <tr className='text-left text-gray-600 border-b border-t'>
                <td className='padding-2'>Date</td>
                <td className='padding-2'>Amount</td>
                <td className='padding-2'>Type</td>
            </tr>
          {filtered.map((t, idx) => (
            <tr key={idx} className="border-t text-gray-800">
              <td className='padding-2'>{t.date}</td>
              <td className={t.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                ₹{t.amount}
              </td>
              <td className="text-gray-600 padding-2">{t.label}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

export default TransactionFilter;
