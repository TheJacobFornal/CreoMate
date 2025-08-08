import React, { useState } from 'react';
import { useEffect } from 'react';
import Page1 from './Page_1/Page1';
import Page2 from './Page_2/Page2';
import Page3 from './Page_3/Page3';
import Page4 from './Page_4/Page4';
import './App.css';
import SideMenu from './SideMenu/SideMenu';

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
  const [activePage, setActivePage] = useState(1);
  const [Purchases_Excel, setPurchases_Excel] = useState("");



  const resetApp = () => {
    setBomPath('');
    setRemoveHItems(false);
    setRemoveMirror(false);
    setReady2(false);
    setReady3(false);
    setDrawingPath('');
    setCurrentPhase(1);
    setStatuses({ phase1: 'idle', phase2: 'idle', phase3: 'idle' });
    setScore2(" ");
    setScore3(" ");
    setComment("Witaj w CreoMate! Wybierz plik BOM i rozpocznij proces.");
    setExcelButtonColor("#949494");
  };

  const runPhase = async (phaseKey, url) => {
    setStatuses(s => ({ ...s, [phaseKey]: 'running' }));
    let dotCount = 0;
    setComment("Loading");

    const loadingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setComment("Loading" + ".".repeat(dotCount));
    }, 500);

    setTimeout(async () => {
      clearInterval(loadingInterval);
      try {
        let res = (phaseKey === "phase2")
          ? await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ removeHItems, removeMirror }),
          })
          : await fetch(url);

        const data = await res.json();

        if (phaseKey === "phase1" && data.ready) {
          setComment("BOM został poprawnie przetworzony i zapisany w Excelu.");
          setExcelButtonColor("#0066ff");
        } else if (phaseKey === "phase2" && data.message) {
          setScore2(data.message);
          setComment(data.ready ? "Etap 2 zakończony pomyślnie. Możesz przejść do etapu 3." : "Popraw Excel, aby kontynuować.");
        } else if (phaseKey === "phase3" && data.message) {
          setScore3(data.message);
          setComment(data.ready ? "Etap 3 zakończony pomyślnie. Wygeneruj Excel do działu zakupów." : "Sprawdź rysunki, aby kontynuować.");
        } else if (phaseKey === "phase4") {
          setComment(data.ready ? "Wygenerowano gotowy plik." : "Nie udało się wygenerować pliku.");
        }


        setStatuses(s => ({ ...s, [phaseKey]: data.ready ? 'done' : 'running' }));
        if (data.ready) setCurrentPhase(p => p < 5 ? p + 1 : p);
      } catch (err) {
        setStatuses(s => ({ ...s, [phaseKey]: 'idle' }));
        alert(`Error running ${phaseKey}: ${err.message}`);
      }
    }, 1700);
  };

  const isExcelOpen = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/isExcelOpen");
      const text = await res.text();
      const data = JSON.parse(text);
      return data.open;
    } catch (err) {
      console.error("Failed to check Excel status:", err);
      return false;
    }
  };

  const handleStart = async () => {
    let excelOpen = false;
    if (currentPhase > 1) {
      excelOpen = await isExcelOpen();
    }

    if (excelOpen) {
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



    const phaseUrls = {
      1: "http://127.0.0.1:8000/run-phase1",
      2: "http://127.0.0.1:8000/run-phase2",
      3: "http://127.0.0.1:8000/run-phase3",
      4: "http://127.0.0.1:8000/run-phase4",
      10: "http://127.0.0.1:8000/run-phase10",
    };

    if (currentPhase >= 1 && currentPhase <= 4) {
      await runPhase(`phase${currentPhase}`, phaseUrls[currentPhase]);
    } else if (currentPhase === 5) {
      resetApp();
    } else {
      alert("All phases complete!");
    }
  };

  const openExcel = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/openExcel");
      const data = await res.json();
      if (data.ready) console.log("Excel opened successfully.");
    } catch (err) {
      console.error("Failed to open Excel:", err);
    }
  };

  const openExcelPurchases = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/openExcelPurchases");
      const data = await res.json();
      if (data.ready) console.log("Purchase Excel opened.");
    } catch (err) {
      console.error("Failed to open Excel:", err);
    }
  };



  const getButtonLabel = () => {
    if (currentPhase <= 3) return `Start Etap ${currentPhase}`;
    if (currentPhase === 4) return "Wygeneruj Gotowy Excel";
    if (currentPhase === 5) return "Nowy BOM";
    return "Proces zakończony";
  };



  // PAGE 2 Process


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
    <SideMenu activePage={activePage} setActivePage={setActivePage} />



      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {activePage === 1 && (
          <Page1
            bomPath={bomPath}
            setBomPath={setBomPath}
            removeHItems={removeHItems}
            setRemoveHItems={setRemoveHItems}
            removeMirror={removeMirror}
            setRemoveMirror={setRemoveMirror}
            ready2={ready2}
            setReady2={setReady2}
            ready3={ready3}
            setReady3={setReady3}
            drawingPath={drawingPath}
            setDrawingPath={setDrawingPath}
            currentPhase={currentPhase}
            setCurrentPhase={setCurrentPhase}
            statuses={statuses}
            setStatuses={setStatuses}
            score2={score2}
            score3={score3}
            comment={comment}
            excelButtonColor={excelButtonColor}
            handleStart={handleStart}
            getButtonLabel={getButtonLabel}
            openExcel={openExcel}
            openExcelPurchases={openExcelPurchases}
          />
        )}

        {activePage === 2 && (
          <Page2
            drawingPath={drawingPath}
            setDrawingPath={setDrawingPath}
            statues={statuses}
            setStatuses={setStatuses}
            comment={comment}
            excelButtonColor={excelButtonColor}
            getButtonLabel={getButtonLabel}
            purchases_Excel={Purchases_Excel}
            setPurchases_Excel={setPurchases_Excel}
            setComment={setComment}
            setExcelButtonColor={setExcelButtonColor}
          />
        )}

        {activePage === 3 && (
          <Page3></Page3>
        )}

        {activePage === 4 && (
          <Page4 />
        )}
      </div>

    </div>
  );

}

export default App;
