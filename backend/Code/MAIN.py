from pathlib import Path
import shutil
from Code.BOM_Mod import MOD_main
from Code.Excel_Check.Excel_Part1 import Excel_Part_1
from Code.Excel_Check.Excel_Part2 import Excel_Part_2
from Code.Excel_Check.Excel_Part3 import Excel_Part_3
from Code.Excel_Check.Excel_Addision import Excel_addition
from Code.File_Finder import Finder_main
from Code.File_Finder.File_correct import File_correct
from Code.Excel_Purchases import Excel_Purchases_main

import os


def phase1(BOM_path, readyBOM_path, Excel_path):
    print("start 1", flush=True)
    okey = MOD_main.main(BOM_path, Excel_path, readyBOM_path)
    print("phase1: ", okey)
    return okey


def phase2(Excel_path, removeHItems=False, removeMirror=False):
    counter_wrong = 0

    Excel_addition.main(Excel_path)
    counter_1 = Excel_Part_1.main(Excel_path, removeHItems)
    counter_2 = Excel_Part_2.main(Excel_path, removeMirror)
    counter_3 = Excel_Part_3.main(Excel_path)

    counter_wrong = counter_1 + counter_2 + counter_3
    number_of_rows = Excel_addition.number_of_rows(Excel_path) - 1

    if number_of_rows == 0:
        return "No rows to process."

    correct_lines = number_of_rows - counter_wrong

    percent_correct = int(round((correct_lines / number_of_rows) * 100, 2))
    text = f"{correct_lines}/{number_of_rows} ({percent_correct}%) - poprawne"

    return text


def namesCorrection(drowings_folder, correctNames):
    filesToCorrection, filesUnchangedAble = File_correct.main(
        drowings_folder, correctNames
    )

    return filesToCorrection, filesUnchangedAble


def phase3(drowings_folder, Excel_path):
    counter_wrong = 0
    Excel_addition.main(Excel_path)

    counter_wrong = Finder_main.main(Excel_path, drowings_folder)
    number_of_rows = Excel_addition.number_of_rows_drawings(Excel_path)

    correct_lines = number_of_rows - counter_wrong

    if number_of_rows != 0:
        percentage = round((correct_lines / number_of_rows) * 100)
        text = f"{correct_lines}/{number_of_rows} ({percentage}%) - znaleziono"
    else:
        text = "0/0 (0%)"

    return text


def copy_Excel_to_Purchases(Excel_path, Purchases_Excel_path):
    Excel_Purchases_main.main(Excel_path, Purchases_Excel_path)
    os.startfile(Purchases_Excel_path)


def copy_Template_Purchases(Purchases_Excel_Template_path, Purchases_Excel_path):
    if Purchases_Excel_Template_path.exists():
        shutil.copy(Purchases_Excel_Template_path, Purchases_Excel_path)
    else:
        print(
            "Template file does not exist:", Purchases_Excel_Template_path, flush=True
        )
        raise FileNotFoundError(
            "Template file not found.", Purchases_Excel_Template_path
        )


def check_Excel_open(Excel_path):

    if Path(Excel_path).exists():
        try:
            with open(Excel_path, "a"):
                return False  # This means it's NOT locked
        except IOError:
            return True  # This means it's locked
    else:
        return False


def open_Excel_purchases(Purchases_Excel_path):
    os.startfile(Purchases_Excel_path)


def purchase_main(Purchases_Excel_path, drowings_folder=None):
    counter_wrong = 0
    missing_counter = 0

    Excel_addition.main(Purchases_Excel_path)  # clear Excel file from colors
    counter_wrong += Excel_Part_1.main(
        Path(Purchases_Excel_path), removeHItems=False, Zakupy=True
    )
    counter_wrong += Excel_Part_2.main(
        Path(Purchases_Excel_path), removeMirror=False, Zakupy=True
    )

    number_of_rows_drawings = Excel_addition.number_of_rows_drawings(
        Purchases_Excel_path
    )
    number_of_rows = Excel_addition.number_of_rows(Purchases_Excel_path, Zakupy=True)

    correct_lines_Excel = number_of_rows - counter_wrong
    percentage = int(round((correct_lines_Excel / number_of_rows) * 100, 0))
    score_excel = f"{correct_lines_Excel}/{number_of_rows} ({percentage}%) - znaleziono"

    if drowings_folder is not None:
        missing_counter += Finder_main.main(
            Path(Purchases_Excel_path), drowings_folder, Zakupy_bool=True
        )
        correct_lines = number_of_rows_drawings - missing_counter
        percentage_drawings = int(
            round((correct_lines / number_of_rows_drawings) * 100)
        )
        score_drowings = f"{correct_lines}/{number_of_rows_drawings} ({percentage_drawings}%) - znaleziono"

        return score_excel, score_drowings

    return score_excel, None


def phase_2_Tree(Excel_path):
    Excel_addition.main(Excel_path)
    Excel_Part_1.main_Tree(Excel_path)
    print("hello from pahse 2 tree", flush=True)
    return "Kuba "


def phase_3_Tree(Excel_path):
    print("hello from pahse 3 tree", flush=True)
    return "Kuba to szef"


def my_function():
    return "Hello from my_function!"


if __name__ == "__main__":
    result = my_function()
    print("Output:", result)
