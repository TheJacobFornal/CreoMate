function Step2({ removeHItems, setRemoveHItems, removeMirror, setRemoveMirror, ready, setReady, status, setStatuses, setCurrentPhase}) 
 {
  return (
    <div>
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

      <label>
        <input type="checkbox" checked={removeHItems} onChange={() => setRemoveHItems(!removeHItems)} />
        Usuwaj elementy z H1, H2, H...
      </label>
      <br />
      <label>
        <input type="checkbox" checked={removeMirror} onChange={() => setRemoveMirror(!removeMirror)} />
        Usuwaj elementy Lustrzane Lewe
      </label>
      <br />
      <label>
        <input
            type="checkbox"
            checked={ready}
            onChange={(e) => {
            const checked = e.target.checked;
            setReady(checked);

            if (checked) {
                // ✅ Mark phase2 as done
                setStatuses(s => ({ ...s, phase2: 'done' }));
                // ⏭️ Go to phase 3
                setCurrentPhase(3);
            }
        }}
        />
        Ready
      </label>
    </div>
  );
}

export default Step2;
