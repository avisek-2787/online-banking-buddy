import React, { useEffect, useState } from 'react';

const FDList = () => {
  const [fds, setFds] = useState([]);
  const [rds, setRds] = useState([]);
  const [deposits, setMyDeposits] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/fd')
      .then(res => res.json())
      .then(data => setFds(data));
    fetch('http://localhost:5000/api/rd')
      .then(res => res.json())
      .then(data => setRds(data));

    fetch('http://localhost:5000/api/myDeposits')
      .then(res => res.json())
      .then(data => setMyDeposits(data));
  }, []);

  return (
    <React.Fragment>
      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">My Deposits</h2>
        {deposits?.fd?.length === 0 && deposits?.rd?.length === 0 ? <p>No deposits found.</p> :

          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>Amount</th><th>Type</th><th>Tenure</th><th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {deposits?.fd?.map(fd => (
                <tr key={fd.id} className="border-t text-gray-800">
                  <td className='padding-2'>₹{fd.amount}</td>
                  <td className='padding-2'>{fd.label}</td>
                  <td className='padding-2'>{fd.tenure}</td>
                  <td className='padding-2'>{fd.date}</td>
                </tr>
              ))}
            </tbody>
            <tbody>
              {deposits?.rd?.map(rd => (
                <tr key={rd.id} className="border-t text-gray-800">
                  <td className='padding-2'>₹{rd.amount}</td>
                  <td className='padding-2'>{rd.label}</td>
                  <td className='padding-2'>{rd.tenure}</td>
                  <td className='padding-2'>{rd.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">Fixed Deposits</h2>
        {fds.length === 0 ? <p>No FDs found.</p> :

          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>Amount</th><th>Rate (%)</th><th>Tenure</th>
              </tr>
            </thead>
            <tbody>
              {fds.map(fd => (
                <tr key={fd.id} className="border-t text-gray-800">
                  <td className='padding-2'>₹{fd.amount}</td>
                  <td className='padding-2'>{fd.rate}</td>
                  <td className='padding-2'>{fd.tenure}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">Recurring Deposits</h2>
        {rds.length === 0 ? <p>No RDs found.</p> :
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>Amount</th><th>Rate (%)</th><th>Tenure</th>
              </tr>
            </thead>
            <tbody>
              {rds.map(rd => (
                <tr key={rd.id} className="border-t text-gray-800">
                  <td>₹{rd.amount}</td>
                  <td>{rd.rate}</td>
                  <td>{rd.tenure}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        }


      </div>
    </React.Fragment>
  );
};

export default FDList;
