import csv
from itertools import zip_longest
from pathlib import Path
import shutil
import os

from openpyxl import load_workbook
from pandas.core.interchange.from_dataframe import primitive_column_to_ndarray

from BOM_Mod.MOD_Part_1 import MOD_Part_1 as part_1
from BOM_Mod.MOD_Part_2 import MOD_Part_2 as part_2
from BOM_Mod.MOD_Part_3 import MOD_Part_3 as part_3

def main():
    os.system("taskkill /f /im excel.exe")                  # close all excel file


    curr_dir = Path(__file__).parent
    code_dir = curr_dir.parent
    app_dir = code_dir.parent
    BOM_dir =  app_dir / "BOM"
    temp_dir = BOM_dir / "template"
    bom_path = BOM_dir / "bom_ready.txt"
    excel_path = BOM_dir / "bom_ready.xlsx"

    print("part 1:")
    ###////          Part 1         ////###
    main_lines, extension_lines = part_1.main()

    print("part 2:")
    ###////          Part 2         ////###
    main_lines = part_2.main(main_lines)


    print("part 3:")
    ###////          Part 3         ////###
    part_3.main(main_lines, extension_lines)

    os.startfile(bom_path)