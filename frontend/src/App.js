import React, { useState } from "react";
import { useEffect } from "react";
import Page1 from "./Page_1/Page1";
import Page2 from "./Page_2/Page2";
import Page3 from "./Page_3/Page3";
import Page4 from "./Page_4/Page4";
import "./App.css";
import SideMenu from "./SideMenu/SideMenu";

function App() {
  const [bomPath, setBomPath] = useState("");
  const [removeHItems, setRemoveHItems] = useState(false);
  const [removeMirror, setRemoveMirror] = useState(false);

  const [ready2, setReady2] = useState(false);
  const [ready3, setReady3] = useState(false);
  const [ready30, setReady30] = useState(false);

  const [drawingPath, setDrawingPath] = useState("");
  const [currentPhase, setCurrentPhase] = useState(1);
  const [statuses, setStatuses] = useState({
    phase1: "idle",
    phase2: "idle",
    phase3: "idle",
  });
  const [score2, setScore2] = useState(" ");
  const [score3, setScore3] = useState(" ");
  const [comment, setComment] = useState(
    "Witaj w CreoMate! Wybierz plik BOM i rozpocznij proces."
  );
  const [excelButtonColor, setExcelButtonColor] = useState("#949494");
  const [activePage, setActivePage] = useState(1);
  const [Purchases_Excel, setPurchases_Excel] = useState("");
  const [filesToCorrection, setFilesToCorrection] = useState([]);
  const [filesUnchangedAble, setFilesUnchangedAble] = useState([]);

  const [correctFileName, setCorrectFileName] = useState(false); // corecction is needed
  const [correctFileNameChecked, setCorrectFileNameChecked] = useState(false); // checkbox state

  const resetApp = () => {
    setBomPath("");
    setRemoveHItems(false);
    setRemoveMirror(false);
    setReady2(false);
    setReady3(false);
    setReady30(false);
    setDrawingPath("");
    setCurrentPhase(1);
    setStatuses({ phase1: "idle", phase2: "idle", phase3: "idle" });
    setScore2(" ");
    setScore3(" ");
    setComment("Witaj w CreoMate! Wybierz plik BOM i rozpocznij proces.");
    setExcelButtonColor("#949494");
  };

  const runPhase = async (phaseKey, url) => {
    setStatuses((s) => ({ ...s, [phaseKey]: "running" }));
    let dotCount = 0;
    setComment("Loading");

    const loadingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setComment("Loading" + ".".repeat(dotCount));
    }, 500);

    setTimeout(async () => {
      console.log("Phase key:", phaseKey);
      clearInterval(loadingInterval);
      try {
        let res;

        if (phaseKey === "phase2") {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ removeHItems, removeMirror }),
          });
        } else if (phaseKey === "phase30") {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correctFileNameChecked }),
          });
        } else {
          res = await fetch(url);
        }

        const data = await res.json();

        console.log("Response data:", data);

        // Phase 1
        if (phaseKey === "phase1" && data.ready) {
          if (!data.okey) {
            setComment(
              "BOM nie został poprawnie przetworzony. Sprawdź plik Excel."
            );
            setExcelButtonColor("#ff0000");
          } else {
            setComment(
              "BOM został poprawnie przetworzony i zapisany w Excelu."
            );
            setExcelButtonColor("#0066ff");
          }

          // Phase 2
        } else if (phaseKey === "phase2" && data.message) {
          setScore2(data.message);
          setExcelButtonColor("#0066ff");
          setComment(
            data.ready
              ? "Etap 2 zakończony pomyślnie. Możesz przejść do etapu 3."
              : "Popraw Excel, aby kontynuować."
          );

          // Phase 30
        } else if (phaseKey === "phase30") {
          console.log(data.filesToCorrection);
          setComment(
            data.ready
              ? "Nazwy rysunków są okey"
              : "Sprawdź nazwy rysunki, aby kontynuować."
          );
          if (data.filesToCorrection || data.filesUnchangedAble) {
            setFilesToCorrection([]);
            setFilesUnchangedAble([]);
            setCorrectFileName(true);

            setFilesToCorrection(data.filesToCorrection);

            setFilesUnchangedAble(data.filesUnchangedAble);

            console.log("phase 30");
            setComment(
              "Sprawdź nazwy rysunków i zaznacz checkbox, aby je poprawić."
            );
          }

          // Phase 3
        } else if (phaseKey === "phase3") {
          setCorrectFileName(false);
          console.log("phase3, correctrStatus: ", correctFileName);
          setScore3(data.message);
          setComment(
            data.ready
              ? "Etap 3 zakończony pomyślnie. Wygeneruj Excel do działu zakupów."
              : "Sprawdź rysunki, aby kontynuować."
          );
        }

        // Phase 4
        else if (phaseKey === "phase4") {
          setComment(
            data.ready
              ? "Wygenerowano gotowy Excel ;)"
              : "Nie udało się wygenerować pliku."
          );
        }

        setStatuses((s) => ({
          ...s,
          [phaseKey]: data.ready ? "done" : "running",
        }));
        if (data.ready) {
          setCurrentPhase((p) => {
            console.log("p", p);
            if (p === 2) return 30; // special jump from 2 → 30
            if (p === 30) return 3; // special jump from 30 → 3
            if (p < 5) return p + 1; // normal increment
            return p;
          });
        }
      } catch (err) {
        setStatuses((s) => ({ ...s, [phaseKey]: "idle" }));
        alert(`Error running ${phaseKey}: ${err.message} szef`);
        console.log(err.message);
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
    if (currentPhase >= 1) {
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
      30: "http://127.0.0.1:8000/run-namesCorrection",
    };

    if ((currentPhase >= 1 && currentPhase <= 4) || currentPhase == 30) {
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
    if (currentPhase === 30) return "Sprawdź nazwy";
    return "Proces zakończony";
  };

  // PAGE 2 Process

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideMenu activePage={activePage} setActivePage={setActivePage} />

      <div style={{ flexGrow: 1, overflowY: "auto" }}>
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
            ready30={ready30}
            setReady30={setReady30}
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
            filesToCorrection={filesToCorrection}
            filesUnchangedAble={filesUnchangedAble}
            correctFileName={correctFileName} // boolean
            correctFileNameChecked={correctFileNameChecked} // checkbox state
            setCorrectFileNameChecked={setCorrectFileNameChecked}
            setCorrectFileName={setCorrectFileName}
            setComment={setComment}
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

        {activePage === 3 && <Page3></Page3>}

        {activePage === 4 && <Page4 />}
      </div>
    </div>
  );
}

export default App;
