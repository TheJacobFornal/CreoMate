import React, { useState } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import bulb from '../assets/bulb.png';
import './Page1.css';



const Page1 = ({
  bomPath, setBomPath,
  removeHItems, setRemoveHItems,
  removeMirror, setRemoveMirror,
  ready2, setReady2,
  ready3, setReady3,
  drawingPath, setDrawingPath,
  currentPhase,
  statuses, setStatuses,
  score2, score3,
  comment,
  excelButtonColor,
  handleStart,
  getButtonLabel,
  openExcel,
  openExcelPurchases,
  setCurrentPhase, // ✅ Only once
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

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

export default Page1;
