import { useState } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

function App() {
  const [bomPath, setBomPath] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [removeHItems, setRemoveHItems] = useState(false);
  const [removeMirror, setRemoveMirror] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [ready3, setReady3] = useState(false);
  const [drawingPath, setDrawingPath] = useState('');
  const [currentPhase, setCurrentPhase] = useState(1);
  const [statuses, setStatuses] = useState({
    phase1: 'idle',
    phase2: 'idle',
    phase3: 'idle',
  });



  const runPhase = async (phaseKey, url) => {
    setStatuses(s => ({ ...s, [phaseKey]: 'running' }));
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.ready) {
        setStatuses(s => ({ ...s, [phaseKey]: 'done' }));
        setCurrentPhase(prev => prev + 1);
      } else {
        setStatuses(s => ({ ...s, [phaseKey]: 'running' }));
        alert(`Phase ${phaseKey} not ready or failed`);
      }
    } catch (err) {
      setStatuses(s => ({ ...s, [phaseKey]: 'idle' }));
      alert(`Error running ${phaseKey}: ${err.message}`);
    }
  };

  const handleStart = async () => {
    if (currentPhase === 1) {
      await runPhase("phase1", "http://127.0.0.1:8000/run-phase1");
    } else if (currentPhase === 2) {
      await runPhase("phase2", "http://127.0.0.1:8000/run-phase2");
    } else if (currentPhase === 3) {
      await runPhase("phase3", "http://127.0.0.1:8000/run-phase3");
    } else {
      alert("All phases complete!");
    }
  };

  const openExcel = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/openExcel");
      const data = await response.json();

      if (data.ready) {
        console.log("Excel opened successfully.");
      } else {
        console.warn("Excel was opened, but marked as not ready.");
      }
    } catch (error) {
      console.error("Failed to open Excel:", error);
    }
  };


 
  return (
    <div style={{ padding: '1rem' }}>
      <h1>CreoMate</h1>

      <Step1 bomPath={bomPath} setBomPath={setBomPath} status={statuses.phase1} />

      <Step2
        removeHItems={removeHItems}
        setRemoveHItems={setRemoveHItems}
        removeMirror={removeMirror}
        setRemoveMirror={setRemoveMirror}
        ready={ready2}
        setReady={setReady2}
        status={statuses.phase2}
        setStatuses={setStatuses}
        setCurrentPhase={setCurrentPhase}
      />

  
      <Step3
        drawingPath={drawingPath}
        setDrawingPath={setDrawingPath}
        ready={ready3}
        setReady={setReady3}
        status={statuses.phase3}
        setStatuses={setStatuses}
        setCurrentPhase={setCurrentPhase}
      />

      <button
        onClick={handleStart}
        disabled={currentPhase > 3}
        style={{ marginTop: '30px', padding: '10px 20px' }}
      >
        {currentPhase <= 3 ? `Start Phase ${currentPhase}` : 'All Phases Complete'}
      </button>
      <button onClick={openExcel}
        style={{ marginTop: '30px', padding: '10px 20px' }}
      >Otwórz Excel</button>
    </div>
  );
}

export default App;
