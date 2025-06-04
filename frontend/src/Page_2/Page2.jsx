import React, { useState } from 'react';
import Step1 from './P2_components/P2_Step1';
import Step3 from './P2_components/P2_Step3';
import bulb from '../assets/bulb.png';
import './Page2.css';





const Page2 = ({
  ready3, setReady3,
  drawingPath, setDrawingPath,
  currentPhase,
  statuses, setStatuses,
  score2, score3,
  comment, setComment, 
  excelButtonColor,
  getButtonLabel,
  purchases_Excel, 
  setPurchases_Excel,
  setExcelButtonColor
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);




  const runPage2Process = async () => {
   if (purchases_Excel === "") {
      setComment("Wybierz plik Excel!");
      return;
    }

  try {
    setComment("Uruchamianie procesu dla Page2...");
    const res = await fetch("http://127.0.0.1:8000/page2_main"); // Adjust the endpoint
    const data = await res.json();

    if (data.ready) {
      setComment("Proces Page2 zakończony pomyślnie.");
    } else {
      setComment("Proces Page2 nie powiódł się.");
    }
  } catch (err) {
    console.error("Błąd Page2:", err);
    setComment("Wystąpił błąd podczas procesu Page2.");
  }
};


const isExcelOpen = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/isExcelOpen_Purchases");
    const text = await res.text();
    const data = JSON.parse(text);
    return data.open;
  } catch (err) {
    console.error("Failed to check Excel status:", err);
    return false;
  }
};

const openExcelPurchases_Zakupy = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/openExcelPurchases_Zakupy");
    const data = await res.json();
    if (data.ready) {
      setComment("Excel zakupy otwarty.");
      setExcelButtonColor("#0066ff");
    }
  } catch (err) {
    console.error("Błąd otwierania excela zakupowego:", err);
    setComment("Nie udało się otworzyć excela zakupowego.");
  }
};

  return (
    <div className="Page_1">
      <div className="header_container">
        <h1 id="Header">CreoMate</h1>
      </div>

      <div className="box">
        <div className="main-box" id="child">
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
              <p>Długość Profilu - <span style={{ backgroundColor: 'grey', color: "grey" }}>........</span></p>
              <p>Lewy elem (P) - <span style={{ backgroundColor: '#FF3399', color: "#FF3399" }}>........</span></p>
              <p>Tylko Lewy elem - <span style={{ backgroundColor: '#42FF48', color: "#42FF48" }}>........</span></p>
            </div>
            <div className="setion_legend" id="last_section_lengend">
              <h5>Rysunki</h5>
              <p>Brak Rysunku - <span style={{ backgroundColor: '#00B0F0', color: "#00B0F0" }}>........</span></p>
            </div>
          </div>

          <div className="phase_div">
            <Step1 purchases_Excel={purchases_Excel} setPurchases_Excel={setPurchases_Excel} />
          </div>


          <div className="phase_div">
            <Step3
              drawingPath={drawingPath}
              setDrawingPath={setDrawingPath}

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
          <button onClick={runPage2Process}>
            Start 
          </button>
        </div>
        <div className="button_div_3">
          <button
            onClick={async () => {
              const open = await isExcelOpen();
              if (!open) {
                openExcelPurchases_Zakupy();
              } else {
                setComment("Excel jest już otwarty.");
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

export default Page2;
