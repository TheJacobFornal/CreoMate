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
from Code.BOM_Mod.MOD_Part_3.MOD_Part_3 import main as part3_main


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
    okey = part3_main(main_lines, extension_lines, Excel_path, readyBom_path)

    return okey


if __name__ == "__main__":
    BOM_path = r"C:\Users\JakubFornal\Downloads\il42_00000000-stan_kontr-z.bom (2).1"
    Excel_path = r"C:\Users\JakubFornal\Desktop\CreoMate\BOM CreoMate.xlsx"
    readyBom_path = r"C:\Users\JakubFornal\Desktop\CreoMate\readyBOM.txt"

    main(BOM_path, Excel_path, readyBom_path)
    os.startfile(Excel_path)
