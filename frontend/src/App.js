import { useState } from 'react';
import { useEffect } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import bulb from './assets/bulb.png';
import './App.css';



function App() {
  const [bomPath, setBomPath] = useState('');
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
  const [score2, setScore2] = useState(" ");
  const [score3, setScore3] = useState(" ");
  const [comment, setComment] = useState("Witaj w CreoMate! Wybierz plik BOM i rozpocznij proces.");
  const [excelButtonColor, setExcelButtonColor] = useState("#949494");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };



  const resetApp = () => {
    setBomPath('');

    setRemoveHItems(false);
    setRemoveMirror(false);
    setReady2(false);
    setReady3(false);
    setDrawingPath('');
    setCurrentPhase(1);
    setStatuses({
      phase1: 'idle',
      phase2: 'idle',
      phase3: 'idle',
    });
    setScore2(" ");
    setScore3(" ");
    setComment("Witaj w CreoMate! Wybierz plik BOM i rozpocznij proces.");
    setExcelButtonColor("#949494");
    setIsMenuOpen(false);
  };




  const runPhase = async (phaseKey, url) => {
    setStatuses(s => ({ ...s, [phaseKey]: 'running' }));

    let dotCount = 0;
    setComment("Loading");

    const loadingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setComment("Loading" + ".".repeat(dotCount));
    }, 500);

    // Wait 5 seconds before starting the API call
    setTimeout(async () => {
      clearInterval(loadingInterval); // stop loading animation

      try {
        let res, data;

        if (phaseKey === "phase2") {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              removeHItems,
              removeMirror,
            }),
          });
        } else {
          res = await fetch(url);
        }

        data = await res.json();

        if (phaseKey === "phase1" && data.ready) {
          setComment("BOM został poprawnie przetworzony i zapisany w Excelu.");
          setExcelButtonColor("#0066ff");
        }

        if (phaseKey === "phase2" && data.message) {
          setScore2(data.message);

          if (data.ready) {
            setComment("Etap 2 zakończony pomyślnie. Możesz przejść do etapu 3.");

          }
          else {
            setComment("Popraw Excel, aby kontynuować.");
          }
        }

        if (phaseKey === "phase3" && data.message) {
          setScore3(data.message);
          if (data.ready) {
            setComment("Etap 3 zakończony pomyślnie. Wygeneruj Excel do działu zakupów.");
          } else {
            setComment("Sprawdź rysunki, aby kontynuować.");
          }
        }


        if (data.ready) {
          setStatuses(s => ({ ...s, [phaseKey]: 'done' }));
          setCurrentPhase(prev => prev <= 5 ? prev + 1 : prev);

        } else {
          setStatuses(s => ({ ...s, [phaseKey]: 'running' }));
        }
      } catch (err) {
        setStatuses(s => ({ ...s, [phaseKey]: 'idle' }));
        alert(`Error running ${phaseKey}: ${err.message}`);
      }
    }, 1700);
  };

const isExcelOpen = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/isExcelOpen");
    const text = await res.text(); // force log full raw response
    console.log("Excel check response (raw):", text);
    const data = JSON.parse(text);
    return data.open;
  } catch (err) {
    console.error("Failed to check Excel status:", err);
    return false;
  }
};


  const handleStart = async () => {
  
    let excelOpen = false
    if (currentPhase > 1) {
      excelOpen = await isExcelOpen();
    }

    if (excelOpen) {
      console.log("Excel is already open. - Kuba update");
      setComment("Excel jest już otwarty. Zamknij go!");
      return;
    }

    if (drawingPath === "" && currentPhase === 3) {
      setComment("Wybierz folder z rysunkami!");
      return;
    }

    if (bomPath === "" && currentPhase === 1) {
      setComment("Wybierz plik BOM!");
      return;
    }


    if (currentPhase === 1) {
      await runPhase("phase1", "http://127.0.0.1:8000/run-phase1");
    } else if (currentPhase === 2) {
      await runPhase("phase2", "http://127.0.0.1:8000/run-phase2");
    } else if (currentPhase === 3) {
      await runPhase("phase3", "http://127.0.0.1:8000/run-phase3");
    } else if (currentPhase === 4) {
      await runPhase("phase4", "http://127.0.0.1:8000/run-phase4");
    } else if (currentPhase === 5) {
      resetApp();
    } else {
      alert("All phases complete!");
    }
  };

  const openExcel = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/openExcel");
      const data = await response.json();

      if (data.ready) {
        console.log("Excel opened successfully. Kuba update");
      } else {
        console.warn("Excel was opened, but marked as not ready.");
      }
    } catch (error) {
      console.error("Failed to open Excel:", error);
    }
  };


  const openExcelPurchases = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/openExcelPurchases");
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

  const getButtonLabel = () => {
    if (currentPhase <= 3) return `Start Etap ${currentPhase}`;
    if (currentPhase === 4) return "Wygeneruj Gotowy Excel";
    if (currentPhase === 5) return "Nowy BOM";
    return "Proces zakończony";
  };



  return (
    <div className="Page_1">
      <div className="header_container">
        <h1 id="Header">CreoMate</h1>
      </div>

      <div className="box">
        <div className="main-box" id="child">
          {/* Hint toggle and panel INSIDE main-box */}
          <div className="hint-toggle" onClick={toggleMenu}>
            <img src={bulb} alt="Hint Icon" />
          </div>
          <div className={`hint-panel ${isMenuOpen ? 'open' : ''}`}>
            <h4>Legenda Kolorów</h4>
            <div className="setion_legend">
              <p>Brak Typu - <span style={{ backgroundColor: '#00FFB7', color: '#00FFB7' }}>........</span></p>
            </div>
            <div className="setion_legend">
              <h5>Handlowe</h5>
              <p>H1, H2, H... - <span style={{ backgroundColor: 'yellow', color: 'yellow' }}>........</span></p>
              <p>Brak Producenta - <span style={{ backgroundColor: 'red', color: 'red' }}>........</span></p>
              <p>Domyślne opisy - <span style={{ backgroundColor: 'orange', color: 'orange' }}>........</span></p>
            </div>
            <div className="setion_legend">
              <h5>Produkowane</h5>
              <p>Materiał / Obróbki - <span style={{ backgroundColor: '#ABA200', color: "#ABA200" }}>........</span></p>
              <p>"_" w numerze - <span style={{ backgroundColor: '#D3A6FF', color: "#D3A6FF" }}>........</span></p>
              <p>Dlugość Profilu - <span style={{ backgroundColor: 'grey', color: "grey" }}>........</span></p>
              <p>Lewy elem (P) - <span style={{ backgroundColor: '#FF3399', color: "#FF3399" }}>........</span></p>
              <p>Tylko Lewy elem - <span style={{ backgroundColor: '#42FF48', color: "#42FF48" }}>........</span></p>
            </div>
            <div className="setion_legend" id="last_section_lengend">
              <h5>Rysunki</h5>
              <p>Brak Rysunku - <span style={{ backgroundColor: '#00B0F0', color: "#00B0F0" }}>........</span></p>
            </div>

          </div>

          <div className="phase_div">
            <Step1 bomPath={bomPath} setBomPath={setBomPath} status={statuses.phase1} />
          </div>

          <div className="phase_div">
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
              score2={score2}
            />
          </div>

          <div className="phase_div">
            <Step3
              drawingPath={drawingPath}
              setDrawingPath={setDrawingPath}
              ready={ready3}
              setReady={setReady3}
              status={statuses.phase3}
              setStatuses={setStatuses}
              setCurrentPhase={setCurrentPhase}
              score3={score3}
            />
          </div>
        </div>
        <div className="info_container">
          <h3>{comment}</h3>
        </div>
      </div>

      <div className="buttons_container">
        <div className="button_div_1">
        </div>





        <div className="button_div_2">
          <button
            onClick={handleStart}
            style={{
              backgroundColor: currentPhase === 5 ? "#FF0A0A" : undefined,
              color: currentPhase === 5 ? "white" : undefined,
            }}
          >
            {getButtonLabel()}
          </button>



        </div>
        <div className="button_div_3">
          <button
            onClick={() => {
              if (currentPhase > 4) {
                openExcelPurchases(); // replace with your actual function
              } else {
                openExcel();
              }
            }}
            style={{ backgroundColor: excelButtonColor }}
          >
            Otwórz Excel
          </button>
        </div>

      </div>
    </div >


  );
}

export default App;
