from pathlib import Path
import shutil
from Code.BOM_Mod import MOD_main
from Code.Excel_Check.Excel_Part1 import Excel_Part_1
from Code.Excel_Check.Excel_Part2 import Excel_Part_2
from Code.Excel_Check.Excel_Part3 import Excel_Part_3
from Code.Excel_Check.Excel_Addision import Excel_addition
from Code.File_Finder import Finder_main
from Code.Excel_Purchases import Excel_Purchases_main

import os




def phase1(BOM_path, readyBOM_path, Excel_path):
    print("start 1", flush=True)
    MOD_main.main(BOM_path, Excel_path, readyBOM_path)
    return Excel_path

def phase2(Excel_path, removeHItems=False, removeMirror=False):
    counter_wrong = 0

    Excel_addition.main(Excel_path)
    counter_1 = Excel_Part_1.main(Excel_path, removeHItems)
    counter_2 = Excel_Part_2.main(Excel_path, removeMirror)
    counter_3 = Excel_Part_3.main(Excel_path)

    counter_wrong = counter_1 + counter_2 + counter_3
    number_of_rows = Excel_addition.number_of_rows(Excel_path)

    if number_of_rows == 0:
        return "No rows to process."

    percent_correct = 100 - round((counter_wrong / number_of_rows) * 100, 2)
    text = f"{counter_wrong}/{number_of_rows} ({percent_correct}%)"

    return text


def phase3(drowings_folder, Excel_path):
    counter_wrong = 0
    Excel_addition.main(Excel_path)
    counter_wrong = Finder_main.main(Excel_path, drowings_folder)
    number_of_rows = Excel_addition.number_of_rows_drawings(Excel_path)


    if number_of_rows != 0:
        text = str(counter_wrong) + "/" + str(number_of_rows) + " (" + str(100 - round((counter_wrong / number_of_rows) * 100, 2)) + "%)"
    else:
        text = "0/0 (100%)"
    return text


def copy_Excel_to_Purchases(Excel_path, Purchases_Excel_path):   
    Excel_Purchases_main.main(Excel_path, Purchases_Excel_path)
    os.startfile(Purchases_Excel_path)


def copy_Template_Purchases(Purchases_Excel_Template_path, Purchases_Excel_path):
    if Purchases_Excel_Template_path.exists():
        shutil.copy(Purchases_Excel_Template_path, Purchases_Excel_path)
    else:
        print("Template file does not exist:", Purchases_Excel_Template_path, flush=True)
        raise FileNotFoundError("Template file not found.", Purchases_Excel_Template_path)
    




def check_Excel_open(Excel_path):

    if Excel_path.exists():
        try:
            with open(Excel_path, 'a'):
                return False  # This means it's NOT locked
        except IOError:
            return True  # This means it's locked
    else:
        return False
    

def open_Excel_purchases(Purchases_Excel_path):
    os.startfile(Purchases_Excel_path)











def purchase_main(Purchases_Excel_path, drowings_folder = None):
    print("Starting purchase main function...", flush=True)
    print("Purchases Excel Path:", Purchases_Excel_path, flush=True)
    print("Drowings Folder:", drowings_folder, flush=True)




   


