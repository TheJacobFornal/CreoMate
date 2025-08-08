import csv
from itertools import zip_longest
from pathlib import Path
import shutil
import os

from openpyxl import load_workbook
from pandas.core.interchange.from_dataframe import primitive_column_to_ndarray

from Code.BOM_Mod.MOD_Part_1 import MOD_Part_1 as part_1
from Code.BOM_Mod.MOD_Part_2 import MOD_Part_2_main as part_2_main
from Code.BOM_Mod.MOD_Part_2 import MOD_Part_2_extension as part_2_extension
from Code.BOM_Mod.MOD_Part_3 import MOD_Part_3 as part_3

def main(BOM_path, Excel_path, readyBom_path):

    print("part 1:", flush=True)
    ###////          Part 1         ////###
    main_lines, extension_lines = part_1.main(BOM_path)



    print("part 2:", flush=True)
    ###////          Part 2         ////###
    main_lines = part_2_main.main(main_lines)
    extension_lines = part_2_extension.main(extension_lines)



    print("part 3:", flush=True)
    ###////          Part 3         ////###
    part_3.main(main_lines, extension_lines, Excel_path, readyBom_path)


if __name__ == "__main__":
    BOM_path = r"C:\Users\JakubFornal\Downloads\iz10_00000000-stan_skrecania-z.bom (1).5"
    Excel_path = r"C:\Users\JakubFornal\Desktop\CreoMate\BOM CreoMate.xlsx"
    readyBom_path = r"C:\Users\JakubFornal\Desktop\CreoMate\readyBOM.txt"

    main(BOM_path, Excel_path, readyBom_path)
    os.startfile(Excel_path)
    
    
    
    


