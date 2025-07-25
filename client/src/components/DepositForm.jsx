import React, { useState } from 'react';

const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('fd');
  const [tenure, setTenure] = useState(12);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type, tenure })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Deposit failed.');
      } else {
        setStatus('success');
        setMessage(`Deposit successful! New balance: ₹${data.balance}`);
        setAmount('');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Server error.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Make a Deposit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="type"
              value="fd"
              checked={type === 'fd'}
              onChange={() => setType('fd')}
            />
            FD
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="type"
              value="rd"
              checked={type === 'rd'}
              onChange={() => setType('rd')}
            />
            RD
          </label>
        </div>
        <div><select
          name="tenure"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Tenure</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
          <option value="36">36 months</option>
          <option value="60">60 months</option>
        </select></div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (₹)"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Deposit
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 text-sm px-3 py-2 rounded-lg ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default DepositForm;
