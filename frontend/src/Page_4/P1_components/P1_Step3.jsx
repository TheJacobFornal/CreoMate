function Step3({ drawingPath, setDrawingPath, ready, setReady, status, setStatuses, setCurrentPhase, score3 }) {
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
        </h2>
        <h3 id="scpre_header">{score3}</h3>
      </div>

      <div className="input_line_phase" style={{ marginLeft: '15px' }}>
        <label className="label_main">Rysunki:</label>
        <div className="input_icon_div">
          <input
            id="custom-input"
            value={drawingPath}
            style={{ width: '535px' }}
            readOnly

          />
          <button id="button_folder" onClick={handleChooseFolder}>📁</button>
        </div>
      </div>
      
      <div className="switch-container" style={{ marginLeft: '15px' }}>
        <label className="switch">
          <input
            type="checkbox"
            checked={ready}
            onChange={(e) => {
              const checked = e.target.checked;
              setReady(checked);

              if (checked) {
                setStatuses((s) => ({ ...s, phase3: 'done' }));
                setCurrentPhase(4);
              }
              else {
                setStatuses((s) => ({ ...s, phase3: 'idle' }));
                setCurrentPhase(3);
              }
            }}
          />
          <span className="slider"></span>
        </label>
        <span className="switch-label">Gotowe</span>
      </div>

    </div>
  );
}

export default Step3;
