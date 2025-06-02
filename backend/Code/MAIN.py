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

def phase2(removeHItems = False, removeMirror= False):
    global Excel_path
    counter_wrong = 0
    counter_1 = 0
    counter_2 = 0
    counter_3 = 0

    Excel_addition.main(Excel_path)
    counter_1 = Excel_Part_1.main(Excel_path, removeHItems)
    counter_2 = Excel_Part_2.main(Excel_path, removeMirror)
    counter_3 = Excel_Part_3.main(Excel_path)

    #print("Counter 1:", counter_1, "Counter 2:", counter_2, "Counter 3:", counter_3, flush=True)
    counter_wrong = counter_1 + counter_2 + counter_3
    number_of_rows = Excel_addition.number_of_rows(Excel_path)
    
    text = str(counter_wrong) + "/" + str(number_of_rows) + " (" + str(100 - round((counter_wrong / number_of_rows) * 100, 2)) + "%)"
    
    return text

def phase3(drowings_folder):
    global Excel_path
    counter_wrong = 0
    Excel_addition.main(Excel_path)
    counter_wrong = Finder_main.main(Excel_path, drowings_folder)
    number_of_rows = Excel_addition.number_of_rows_drawings(Excel_path)


    if number_of_rows != 0:
        text = str(counter_wrong) + "/" + str(number_of_rows) + " (" + str(100 - round((counter_wrong / number_of_rows) * 100, 2)) + "%)"
    else:
        text = "0/0 (100%)"
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
   


