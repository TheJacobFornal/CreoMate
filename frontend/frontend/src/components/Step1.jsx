import React from 'react';

function Step1({ bomPath, setBomPath, status }) {
  const handleChooseFile = async () => {
    const res = await fetch('http://127.0.0.1:8000/chooseFile');
    const data = await res.json();
    if (data.path) setBomPath(data.path);
  };

  return (
    <div>
      <h2 style={{ color: 'red' }}>
        Etap 1: <span style={{ color: 'blue' }}>BOM → Excel</span>
        <span style={{
          display: 'inline-block',
          width: '12px',
          height: '12px',
          marginLeft: '10px',
          borderRadius: '50%',
          backgroundColor: status === 'done' ? 'green' : status === 'running' ? 'orange' : 'red',
          border: '1px solid #333'
        }} />
      </h2> {/* ✅ FIX: close the h2 tag here */}

<input
  value={bomPath}
  
  style={{ width: '300px' }}
  readOnly
/>

      <button onClick={handleChooseFile}>📁</button>
    </div>
  );
}

export default Step1;
