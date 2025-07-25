function Step2({ removeHItems, setRemoveHItems, removeMirror, setRemoveMirror, ready, setReady, status, setStatuses, setCurrentPhase, score2}) 
 {
  return (
    <div>
      <div className="step1-header_container">
        <h2 style={{ color: 'red' }}>
        Etap 2: <span style={{ color: 'blue' }}>Modyfikacja Excel</span>
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
        <h3 id="scpre_header">{score2}</h3>
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
            setStatuses((s) => ({ ...s, phase2: 'done' }));
            setCurrentPhase(3);
          }
          else{
            setStatuses((s) => ({ ...s, phase2: 'idle' }));
            setCurrentPhase(2); // Optional: move back to phase 2
          }
        }}s
      />
      <span className="slider"></span>
    </label>
    <span className="switch-label">Gotowe</span>
  </div>

    </div>
  );
}

export default Step2;
