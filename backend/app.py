import sys
from pathlib import Path

# Use _MEIPASS if running from a PyInstaller bundle
base_path = Path(getattr(sys, '_MEIPASS', Path(__file__).parent))
code_path = base_path / "Code"
sys.path.insert(0, str(code_path))

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import sys
import multiprocessing
import time
from tkinter import Tk, filedialog
import os
from Code import MAIN as Main1



Excel_path = None
BOM_path = None
Drowings_dir = None

def create_app():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"]
    )


    @app.get("/ping")
    def ping(name: str):
        return {"message": f"Hello, {name}!"}
    
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
        global BOM_path
        global Excel_path
        print("app phase1:", BOM_path, flush=True)
        Excel_path = Main1.phase1(BOM_path)
        return {"ready": True}

    @app.get("/run-phase2")
    def run2():
        Main1.phase2()
        return {"ready": False}

    @app.get("/run-phase3")
    def run_phase3():
        global Drowings_dir
        Main1.phase3(Drowings_dir)
        return {"ready": False}
    



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




        
    return app



def run_uvicorn():
    print("Running Uvicorn...")
    uvicorn.run(create_app(), host="127.0.0.1", port=8000, log_config=None)

def run():
    server = multiprocessing.Process(target=run_uvicorn)
    server.start()

    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        print("Shutting down backend...")
        server.terminate()
        server.join()

if __name__ == "__main__" or getattr(sys, 'frozen', False):
    multiprocessing.freeze_support()  
    run()
