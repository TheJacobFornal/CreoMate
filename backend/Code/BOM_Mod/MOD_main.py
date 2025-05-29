import csv
from itertools import zip_longest
from pathlib import Path
import shutil
import os

from openpyxl import load_workbook
from pandas.core.interchange.from_dataframe import primitive_column_to_ndarray

from Code.BOM_Mod.MOD_Part_1 import MOD_Part_1 as part_1
from Code.BOM_Mod.MOD_Part_2 import MOD_Part_2 as part_2
from Code.BOM_Mod.MOD_Part_3 import MOD_Part_3 as part_3

def main(BOM_path, Excel_path, readyBom_path):

    print("part 1:", flush=True)
    ###////          Part 1         ////###
    main_lines, extension_lines = part_1.main(BOM_path)

    print("part 2:", flush=True)
    ###////          Part 2         ////###
    main_lines = part_2.main(main_lines)


    print("part 3:", flush=True)
    ###////          Part 3         ////###
    part_3.main(main_lines, extension_lines, Excel_path, readyBom_path)

