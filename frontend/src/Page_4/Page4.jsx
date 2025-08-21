import React, { useState } from "react";
import Step1 from "./P1_components/P1_Step1";
import Step2 from "./P1_components/P1_Step2";
import Step3 from "./P1_components/P1_Step3";
import bulb from "../assets/bulb.png";
import "./Page4.css";

const Page4 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Local state for excel path used only on Page4
  const [bomPath, setBomPath] = useState("");

  // Localised state copied from App for independent use on Page4
  const [removeHItems, setRemoveHItems] = useState(false);
  const [removeMirror, setRemoveMirror] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [ready3, setReady3] = useState(false);
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

  const resetLocal = () => {
    setBomPath("");
    setRemoveHItems(false);
    setRemoveMirror(false);
    setReady2(false);
    setReady3(false);
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
      clearInterval(loadingInterval);
      try {
        let res;
        if (phaseKey === "phase2") {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ removeHItems }),
          });
        } else {
          res = await fetch(url); // ← FIXED LINE
        }

        const data = await res.json(); // ← PARSE RESPONSE

        if (phaseKey === "phase1" && data.ready) {
          setComment("BOM został poprawnie przetworzony i zapisany w Excelu.");
          setExcelButtonColor("#0066ff");
        } else if (phaseKey === "phase2" && data.message) {
          setScore2(data.message);
          setComment(
            data.ready
              ? "Etap 2 zakończony pomyślnie. Możesz przejść do etapu 3."
              : "Popraw Excel, aby kontynuować."
          );
        } else if (phaseKey === "phase20") {
          setComment(
            data.ready
              ? "Szablon został przekopiowany"
              : "Błąd przy przekopiowyniu do szablonu"
          );
        } else if (phaseKey === "phase3" && data.message) {
          setScore3(data.message);
          setComment(
            data.ready
              ? "Etap 3 zakończony pomyślnie. Wygeneruj Excel do działu zakupów."
              : "Sprawdź rysunki, aby kontynuować."
          );
        } else if (phaseKey === "phase4") {
          setComment(
            data.ready
              ? "Plik Dokumentacja zwraz z folderem jest gotowy"
              : "Sprawdź rysunki, aby kontynuować."
          );
        }

        setStatuses((s) => ({
          ...s,
          [phaseKey]: data.ready ? "done" : "running",
        }));
        if (data.ready) {
          setCurrentPhase((p) => {
            if (p === 2) return 20; // jump from phase 2 → phase 20
            if (p === 20) return 3; // jump from phase 20 → phase 3
            return p < 5 ? p + 1 : p; // normal increment
          });
        }
      } catch (err) {
        setStatuses((s) => ({ ...s, [phaseKey]: "idle" }));
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

    if (bomPath === "" && currentPhase === 1) {
      setComment("Wybierz plik BOM!");
      return;
    }

    const phaseUrls = {
      1: "http://127.0.0.1:8000/Tree_phase1",
      2: "http://127.0.0.1:8000/Tree_phase2",
      3: "http://127.0.0.1:8000/Tree_phase3",
      4: "http://127.0.0.1:8000/Tree_phase4",
      10: "http://127.0.0.1:8000/run-phase10",
      20: "http://127.0.0.1:8000/copy_Excel_Tree",
    };

    if ((currentPhase >= 1 && currentPhase <= 4) || currentPhase == 20) {
      console.log("currpahse: ", currentPhase);
      await runPhase(`phase${currentPhase}`, phaseUrls[currentPhase]);
    } else if (currentPhase === 5) {
      resetLocal();
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
    if (currentPhase === 20) return "Przekopij do Szablonu";
    if (currentPhase === 4) return "Wyczyść";
    return "Zrestuj";
  };

  return (
    <div className="Page_1">
      <div className="header_container">
        <h1 id="Header">TreeMate</h1>
      </div>

      <div className="box">
        <div className="main-box" id="child">
          <div className="hint-toggle" onClick={toggleMenu}>
            <img src={bulb} alt="Hint Icon" />
          </div>

          <div className={`hint-panel ${isMenuOpen ? "open" : ""}`}>
            <h4>Legenda Kolorów</h4>
            <div className="setion_legend">
              <p>
                Brak Typu -{" "}
                <span style={{ backgroundColor: "#00FFB7", color: "#00FFB7" }}>
                  ........
                </span>
              </p>
              <p>
                Nr Kat (B) -{" "}
                <span style={{ backgroundColor: "#6699FF", color: "#6699FF" }}>
                  ........
                </span>
              </p>
            </div>
            <div className="setion_legend">
              <h5>Handlowe</h5>
              <p>
                H1, H2, H... -{" "}
                <span style={{ backgroundColor: "yellow", color: "yellow" }}>
                  ........
                </span>
              </p>
              <p>
                Brak Producenta -{" "}
                <span style={{ backgroundColor: "red", color: "red" }}>
                  ........
                </span>
              </p>
              <p>
                Domyślne opisy -{" "}
                <span style={{ backgroundColor: "orange", color: "orange" }}>
                  ........
                </span>
              </p>
            </div>
            <div className="setion_legend">
              <h5>Produkowane</h5>
              <p>
                Materiał / Obróbki -{" "}
                <span style={{ backgroundColor: "#ABA200", color: "#ABA200" }}>
                  ........
                </span>
              </p>
              <p>
                "_" w numerze -{" "}
                <span style={{ backgroundColor: "#D3A6FF", color: "#D3A6FF" }}>
                  ........
                </span>
              </p>
              <p>
                Długość Profilu -{" "}
                <span style={{ backgroundColor: "grey", color: "grey" }}>
                  ........
                </span>
              </p>
              <p>
                Lewy elem (P) -{" "}
                <span style={{ backgroundColor: "#FF3399", color: "#FF3399" }}>
                  ........
                </span>
              </p>
              <p>
                Tylko Lewy elem -{" "}
                <span style={{ backgroundColor: "#42FF48", color: "#42FF48" }}>
                  ........
                </span>
              </p>
            </div>
            <div className="setion_legend" id="last_section_lengend">
              <h5>Rysunki</h5>
              <p>
                Brak Rysunku -{" "}
                <span style={{ backgroundColor: "#00B0F0", color: "#00B0F0" }}>
                  ........
                </span>
              </p>
            </div>
          </div>

          <div className="phase_div">
            <Step1
              bomPath={bomPath}
              setBomPath={setBomPath}
              status={statuses.phase1}
            />
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
        <div className="button_div_1"></div>
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
                openExcelPurchases();
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
    </div>
  );
};

export default Page4;
