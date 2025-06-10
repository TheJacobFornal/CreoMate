import sys
from pathlib import Path

# Use _MEIPASS if running from a PyInstaller bundle
base_path = Path(getattr(sys, '_MEIPASS', Path(__file__).parent))
code_path = base_path / "Code"
sys.path.insert(0, str(code_path))

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import sys
import multiprocessing
import time
from tkinter import Tk, filedialog
import os
from Code import MAIN as Main1



desktop_path = Path.home() / "Desktop"

output_folder = desktop_path / "CreoMate"
output_folder.mkdir(parents=True, exist_ok=True)
Excel_path = output_folder / "BOM CreoMate.xlsx"
readyBOM_path = output_folder / "readyBOM.txt"
Purchases_Excel_Template_path = output_folder / "Szablon Zamówienia.xlsx"
Purchases_Excel_path = output_folder / "Zamówienia CreoMate.xlsx"
Drowings_dir = None


counter = 0

def create_app():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"]
    )


       
    
    @app.get("/chooseFile")
    def choseFiel():
        global BOM_path
        root = Tk()
        root.withdraw()
        BOM_path = filedialog.askopenfilename()
        root.destroy()
        return {"path": BOM_path}
    

    @app.get("/chooseFolder")
    def choseFiel():
        global Drowings_dir
        root = Tk()
        root.withdraw()
        Drowings_dir = filedialog.askdirectory()
        root.destroy()
        return {"path": Drowings_dir}
    
    @app.get("/run-phase1")
    def run_phase1():
        global readyBOM_path
        global BOM_path
        print("app phase1:", BOM_path, flush=True)
        Main1.phase1(BOM_path, readyBOM_path, Excel_path)
        return {"ready": True}



    @app.post("/run-phase2")
    async def run_phase2(request: Request):
        body = await request.json()
        remove_h_items = body.get("removeHItems", False)
        remove_mirror = body.get("removeMirror", False)

        print("Remove H Items:", remove_h_items, flush=True)
        print("Remove Mirror:", remove_mirror, flush=True)
     

        message = Main1.phase2(Excel_path, remove_h_items, remove_mirror)
        return {"ready": False, "message": message}



    @app.get("/run-phase3")
    def run_phase3():
        global Drowings_dir
        score = Main1.phase3(Drowings_dir, Excel_path)
        return {
            "ready": False,
            "message": score
        }
    

    @app.get("/run-phase4")
    def run_phase4():
        Main1.copy_Excel_to_Purchases(Excel_path, Purchases_Excel_path)
        return {
            "ready": True,
        }
    
    

    @app.get("/isExcelOpen")
    def check():
        print("Excel check main", flush=True)
        if Main1.check_Excel_open(Excel_path):
            return {"open": True}
        else:
            return {"open": False}


    @app.get("/openExcel")
    def open_excel():
        global Excel_path 
        print(Excel_path, flush=True) 
        if not os.path.exists(Excel_path):
            raise HTTPException(status_code=404, detail="Excel file not found")
        
        try:
            os.startfile(Excel_path)
            return {"ready": True}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    @app.get("/openExcelPurchases")
    def open_excel_purchases():
       global Purchases_Excel_path
       Main1.open_Excel_purchases(Purchases_Excel_path)


        
        ## Page 2 - Purchases ##
    @app.get("/page2_main")
    def run_phase10():
        global Purchases_Excel_path
        global Drowings_dir

        

        if Drowings_dir is None:
            scoreExcel, scoreDrawings = Main1.purchase_main(Path(Purchases_Excel_path)), None
        else:
            scoreExcel, scoreDrawings = Main1.purchase_main(Path(Purchases_Excel_path), Drowings_dir)

        print(scoreExcel, scoreDrawings, flush=True)
        return {
            "ready": True,
            "scoreExcel": scoreExcel,
            "scoreDrawings": scoreDrawings
        }
  

    @app.get("/isExcelOpen_Purchases")
    def isExcelOpen_Purchases():
        print("Excel check main purchuses", flush=True)
        if Main1.check_Excel_open(Purchases_Excel_path):
            return {"open": True}
        else:
            return {"open": False}


        

    @app.get("/chooseFile_Purchases")
    def choseFiel():
        global Purchases_Excel_path
        root = Tk()
        root.withdraw()
        Purchases_Excel_path = filedialog.askopenfilename()
        root.destroy()
        return {"path": Purchases_Excel_path}
  

    return app

def run_uvicorn():
    print("Running Uvicorn...")
    uvicorn.run(create_app(), host="127.0.0.1", port=8000, log_config=None)

def run():
    server = multiprocessing.Process(target=run_uvicorn)
    server.start()

    Main1.copy_Template_Purchases(Purchases_Excel_Template_path, Purchases_Excel_path)


    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        print("Shutting down backend...")
        server.terminate()
        server.join()

if __name__ == "__main__":
    multiprocessing.freeze_support()  # Needed for PyInstaller on Windows
    run()
