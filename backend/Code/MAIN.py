from pathlib import Path

from Code.BOM_Mod import MOD_main
from Code.Excel_Check.Excel_Part1 import Excel_Part_1
from Code.Excel_Check.Excel_Part2 import Excel_Part_2
from Code.Excel_Check.Excel_Part3 import Excel_Part_3
from Code.Excel_Check.Excel_Addision import Excel_addition
from Code.File_Finder import Finder_main

import os

desktop_path = Path.home() / "Desktop"

output_folder = desktop_path / "CreoMate"
output_folder.mkdir(parents=True, exist_ok=True)
Excel_path = output_folder / "BOM CreoMate.xlsx"
readyBOM_path = output_folder / "readyBOM.txt"



def phase1(BOM_path):
    print("start 1", flush=True)
    MOD_main.main(BOM_path, Excel_path, readyBOM_path)
    return Excel_path

def phase2(removeHItems, removeMirror):
    global Excel_path
    Excel_Part_1.main(Excel_path)
    Excel_Part_2.main(Excel_path)
    Excel_Part_3.main(Excel_path)
    text = "5 / 50 (90%)"
    return text

def phase3(drowings_folder):
    global Excel_path
    Excel_addition.main(Excel_path)
    Finder_main.main(Excel_path, drowings_folder)
    text = "5 / 5 (100%)"
    return text


def check_Excel_open():
    global Excel_path
    if Excel_path.exists():
        try:
            with open(Excel_path, 'a'):
                return True
        except IOError:
            return False
    else:
        return False
   


