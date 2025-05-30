function Step3({ drawingPath, setDrawingPath, ready, setReady, status, setStatuses, setCurrentPhase }) {
  const handleChooseFolder = async () => {
    const res = await fetch('http://127.0.0.1:8000/chooseFolder');
    const data = await res.json();
    if (data.path) setDrawingPath(data.path);
  };

  return (
    <div className="step3-container">
      <div class="step1-header_container">
          <h2 style={{ color: 'red' }}>
            Etap 3: <span style={{ color: 'blue' }}>Sprawdzanie rysunków</span>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              marginLeft: '10px',
              borderRadius: '50%',
              backgroundColor: status === 'done' ? 'green' : status === 'running' ? 'orange' : 'red',
              border: '1px solid #333'
            }} />
          </h2> {/* ✅ Close the <h2> tag here */}
      </div>
      <label class="label_main">Rysunki:         </label>
        <input
            id = "custom-input"
            value={drawingPath}
            style={{ width: '300px' }}
            readOnly
           
        />
      <button id = "button_folder" onClick={handleChooseFolder}>📁</button>
      <br />
      <label class="label_main">
            <input
            type="checkbox"
            checked={ready}
            onChange={(e) => {
            const checked = e.target.checked;
            setReady(checked);
        
            if (checked) {
                // ✅ Mark phase2 as done
                setStatuses(s => ({ ...s, phase3: 'done' }));
                // ⏭️ Go to phase 3
                setCurrentPhase(4);
            }
        }}
          
        />
        Ready
      </label>
    </div>
  );
}

export default Step3;
