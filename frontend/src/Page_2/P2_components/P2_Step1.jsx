import React from 'react';

function Step1({ purchases_Excel, setPurchases_Excel }) {
  const handleChooseFile = async () => {
    const res = await fetch('http://127.0.0.1:8000/chooseFile_Purchases');
    const data = await res.json();
    if (data.path) setPurchases_Excel(data.path);
  };

  return (
    <div className="step1-container">
      <div class="step1-header_container">
        <h2 style={{ color: 'red' }} id="step1-header">
          Excel Zamówienia <span style={{ color: 'blue' }}>Check</span>
          
        </h2>
      </div>

      <div className="input_line_phase">
        <label className="label_main">Excel:</label>
        <div className="input_icon_div">
          <input
            value={purchases_Excel}
            style={{ width: '560px' }}
            readFOnly
            id="custom-input"
          />
          <button id="button_folder" onClick={handleChooseFile}>📁</button>
        </div>
      </div>
      
    </div>
  );

}

export default Step1;
