function Step3({
  drawingPath,
  setDrawingPath,
  ready,
  setReady,
  status,
  setStatuses,
  setCurrentPhase,
  score3,
  correctFileName,
  correctFileNameChecked,
  setCorrectFileNameChecked,
  filesToCorrection,
  filesUnchangedAble,
  setCorrectFileName,
  ready30,
  setReady30,
  setComment,
}) {
  const handleChooseFolder = async () => {
    const res = await fetch("http://127.0.0.1:8000/chooseFolder");
    const data = await res.json();
    if (data.path) setDrawingPath(data.path);

    console.log("step3: ", filesToCorrection);
  };

  return (
    <div className="step3-container">
      <div class="step1-header_container">
        <h2 style={{ color: "red" }}>
          Etap 3: <span style={{ color: "blue" }}>Sprawdzanie rysunków</span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              marginLeft: "10px",
              borderRadius: "50%",
              backgroundColor:
                status === "done"
                  ? "green"
                  : status === "running"
                  ? "orange"
                  : "red",
              border: "1px solid #333",
            }}
          />
        </h2>
        <h3 id="scpre_header">{score3}</h3>
      </div>

      <div className="input_line_phase" style={{ marginLeft: "15px" }}>
        <label className="label_main">Rysunki:</label>
        <div className="input_icon_div">
          <input
            id="custom-input"
            value={drawingPath}
            style={{ width: "535px" }}
            readOnly
          />
          <button id="button_folder" onClick={handleChooseFolder}>
            📁
          </button>
        </div>
      </div>

      {correctFileName && (
        <>
          <div
            className="name_correction"
            style={{
              height: 100, // same fixed height
              marginLeft: 15,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                height: "100%",
              }}
            >
              {/* Left column: filesToCorrection */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {(filesToCorrection ?? []).map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>

              {/* Right column: filesUnachangeAble */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {(filesUnchangedAble ?? []).map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              height: "10",
              marginBottom: 0,
            }}
          >
            <div style={{ flex: 1, overflowY: "auto" }}>
              <label className="label_main" style={{ marginLeft: "15px" }}>
                <input
                  type="checkbox"
                  checked={correctFileNameChecked}
                  onChange={() =>
                    setCorrectFileNameChecked(!correctFileNameChecked)
                  }
                />
                Popraw .DWG automatycznie
              </label>
            </div>

            <div
              style={{ flex: 1, height: 100, marginTop: -15, marginLeft: 15 }}
            >
              <h3>Popraw nazwy manualnie</h3>
            </div>
          </div>

          <div
            className="switch-container"
            style={{ marginLeft: "15px", marginTop: -60 }}
          >
            <label className="switch">
              <input
                type="checkbox"
                checked={ready30}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setReady30(checked);

                  if (checked) {
                    setStatuses((s) => ({ ...s, phase30: "done" }));
                    setCurrentPhase(3);
                    setCorrectFileName(false);
                    setComment("");
                  } else {
                    setStatuses((s) => ({ ...s, phase3: "idle" }));
                    setCurrentPhase(30);
                  }
                }}
              />
              <span className="slider"></span>
            </label>
            <span className="switch-label">Gotowe</span>
          </div>
        </>
      )}

      {!correctFileName && (
        <div className="switch-container" style={{ marginLeft: "15px" }}>
          <label className="switch">
            <input
              type="checkbox"
              checked={ready}
              onChange={(e) => {
                const checked = e.target.checked;
                setReady(checked);

                if (checked) {
                  setStatuses((s) => ({ ...s, phase3: "done" }));
                  setCurrentPhase(4);
                  setComment("Już wszytko prawie gotowe...");
                } else {
                  setStatuses((s) => ({ ...s, phase3: "idle" }));
                  setCurrentPhase(3);
                }
              }}
            />
            <span className="slider"></span>
          </label>
          <span className="switch-label">Gotowe</span>
        </div>
      )}
    </div>
  );
}

export default Step3;
