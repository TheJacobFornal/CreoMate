from pathlib import Path

import Excel_Check
from BOM_Mod import MOD_main
from Excel_Check.Excel_Part1 import Excel_Part_1
from Excel_Check.Excel_Part2 import Excel_Part_2
from Excel_Check.Excel_Part3 import Excel_Part_3
from Excel_Check.Excel_Addision import Excel_addition
from File_Finder import Finder_main
import os

curr_dir = Path(__file__).parent
Excel_Check_dir = curr_dir / "Excel_Check"
BOM_mod_dir = curr_dir / "BOM_mod"
app_dir = curr_dir.parent
BOM_dir = app_dir / "BOM"
temp_dir = BOM_dir / "template"
excel_path = BOM_dir / "bom_ready.xlsx"

def is_Excel_open(filepath):
    try:
        with open(filepath, 'r+b'):
            return False
    except IOError:
        return True

print("1 - Etap 1")
print("2 - Etap 2_1")
print("3 - Etap 2_2")
print("4 - Etap 2_3")
print("5 - Etap 3")

print("50 - Remove bg colors")
print("99 - Wszystko")
mode = input("Input Mode: ")            # BOM_MOD - 1, BOM_Check - 2


if not is_Excel_open(excel_path):
    if mode == str(1):
        MOD_main.main()
    elif mode == str(2):
        Excel_Part_1.main()
    elif mode == str(3):
        Excel_Part_2.main()
    elif mode == str(4):
        Excel_Part_3.main()
    elif mode == str(5):
        Finder_main.main()
    elif mode == str(50):
        Excel_addition.main()
    elif mode == str(99):
        MOD_main.main()
        Excel_Part_1.main()
        Excel_Part_2.main()
        Excel_Part_3.main()
    else:
        print("Invalid Input")
else:
    print(" ")
    print("Excel is opened")


os.startfile(excel_path)

