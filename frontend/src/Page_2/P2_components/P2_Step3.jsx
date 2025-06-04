function Step3({ drawingPath, setDrawingPath, score3 }) {
  const handleChooseFolder = async () => {
    const res = await fetch('http://127.0.0.1:8000/chooseFolder');
    const data = await res.json();
    if (data.path) setDrawingPath(data.path);
  };

  return (
    <div className="step3-container">
      <div class="step1-header_container">
        <h2 style={{ color: 'red' }}>
          <span style={{ color: 'blue' }}>Sprawdzanie rysunków</span>
        </h2>
        <h3 id="scpre_header">{score3}</h3>
      </div>

      <div className="input_line_phase">
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
      
      

    </div>
  );
}

export default Step3;
