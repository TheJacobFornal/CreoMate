import React, { useState } from 'react';
import Step1 from './P2_components/P2_Step1';
import Step3 from './P2_components/P2_Step3';
import bulb from '../assets/bulb.png';
import './Page2.css';
import { useEffect } from 'react'; // already present





const Page2 = ({
  ready3, setReady3,
  drawingPath, setDrawingPath,
  currentPhase,
  statuses, setStatuses,
  comment, setComment, 
  excelButtonColor,
  getButtonLabel,
  purchases_Excel, 
  setPurchases_Excel,
  setExcelButtonColor
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const [score_Excel, setScore_Excel] = useState(" ");
  const [score_drowings, setScore_drowings] = useState(" ");

useEffect(() => {
  if (purchases_Excel) {
    setExcelButtonColor("#0066ff"); // blue
  }
}, [purchases_Excel]);


const runPage2Process = async () => {
  let excelOpen = false
  excelOpen = await isExcelOpen()

    
  if (excelOpen) {
    setComment("Excel jest już otwarty. Zamknij go!");
    return;
  }

  let dotCount = 0;
  const loadingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    setComment("Loading" + ".".repeat(dotCount));
  }, 500);


  try {
    const res = await fetch("http://127.0.0.1:8000/page2_main");
    const data = await res.json();
    clearInterval(loadingInterval);

    if (data.ready) {
      setScore_Excel(data.scoreExcel || "Brak wyniku");
      setScore_drowings(data.scoreDrawings || " ");

      let message = `Excel zakupy gotowy`
      setComment(message);
    } else {
      setComment("Popraw Excel, aby kontunułować");
    }
  } catch (err) {
    clearInterval(loadingInterval);
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
    const res = await fetch("http://127.0.0.1:8000/openExcelPurchases");
    const data = await res.json();
    if (data.ready) {
      setComment("Excel zakupy otwarty.");
    }
  } catch (err) {
    console.error("Błąd otwierania excela zakupowego:", err);
  }
};

  return (
    <div className="Page_1">
      <div className="header_container">
        <h1 id="Header">PurchaseMate</h1>
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
              <p>Powtórzenie - <span style={{ backgroundColor: '#DDD8B8', color: '#DDD8B8' }}>........</span></p>
              <p>Nr Kat (B) - <span style={{ backgroundColor: '#6699FF', color: '#6699FF' }}>........</span></p>
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
            </div>
            <div className="setion_legend" id="last_section_lengend">
              <h5>Rysunki</h5>
              <p>Brak Rysunku - <span style={{ backgroundColor: '#00B0F0', color: "#00B0F0" }}>........</span></p>
            </div>
          </div>

          <div className="phase_div">
            <Step1 purchases_Excel={purchases_Excel} setPurchases_Excel={setPurchases_Excel} score_Excel={score_Excel} />
          </div>


          <div className="phase_div">
            <Step3
              drawingPath={drawingPath}
              setDrawingPath={setDrawingPath}

              score_drowings = {score_drowings}
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
