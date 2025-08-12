import React from "react";

function Step1({ bomPath, setBomPath, status, correctFileName }) {
  const handleChooseFile = async () => {
    const res = await fetch("http://127.0.0.1:8000/chooseFile");
    const data = await res.json();
    if (data.path) setBomPath(data.path);
  };

  return (
    <div className="step1-container">
      <div
        className="step1-header_container"
        style={{
          marginTop: correctFileName ? "-5px" : undefined,
          marginBottom: correctFileName ? "0px" : undefined,
        }}
      >
        <h2 style={{ color: "red" }} id="step1-header">
          Etap 1: <span style={{ color: "blue" }}>BOM → Excel</span>
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
      </div>

      {!correctFileName && (
        <div className="input_line_phase" style={{ marginLeft: "15px" }}>
          <label className="label_main">BOM:</label>
          <div className="input_icon_div">
            <input
              value={bomPath}
              style={{ width: "560px" }}
              id="custom-input"
            />
            <button id="button_folder" onClick={handleChooseFile}>
              📁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step1;
