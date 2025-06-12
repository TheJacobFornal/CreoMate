import React, { useState } from 'react';
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






  // PAGE 2 Process


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SideMenu setActivePage={setActivePage} />


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
            setScore2={setScore2}
            score3={score3}
            setScore3={setScore3}
            comment={comment}
            setComment={setComment}
            excelButtonColor={excelButtonColor}
            setExcelButtonColor={setExcelButtonColor}
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
