from pathlib import Path
import shutil
from .BOM_Mod import MOD_main
from .Excel_Check.Excel_Part1 import Excel_Part_1
from .Excel_Check.Excel_Part2 import Excel_Part_2
from .Excel_Check.Excel_Part3 import Excel_Part_3
from .Excel_Check.Excel_Addision import Excel_addition
from .File_Finder import Finder_main
from .File_Finder.File_correct import File_correct
from .Excel_Purchases import Excel_Purchases_main
from .Excel_Tree import Excel_Tree


import os


def phase1(BOM_path, readyBOM_path, Excel_path):
    okey = MOD_main.main(BOM_path, Excel_path, readyBOM_path)

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

    if number_of_rows > 0:
        correct_lines_Excel = number_of_rows - counter_wrong
        percentage = int(round((correct_lines_Excel / number_of_rows) * 100, 0))
        score_excel = (
            f"{correct_lines_Excel}/{number_of_rows} ({percentage}%) - poprawne"
        )
    else:
        score_excel = "brak danych w Excel"

    if drowings_folder is not None:
        missing_counter += Finder_main.main(
            Path(Purchases_Excel_path), drowings_folder, Zakupy_bool=True
        )

        if number_of_rows_drawings > 0:
            correct_lines = number_of_rows_drawings - missing_counter
            percentage_drawings = int(
                round((correct_lines / number_of_rows_drawings) * 100)
            )
            score_drowings = f"{correct_lines}/{number_of_rows_drawings} ({percentage_drawings}%) - znaleziono"
        else:
            score_drowings = "nie ma rysunków"

        return score_excel, score_drowings

    return score_excel, None


def phase_2_Tree(Excel_path, remove_h_items):
    Excel_addition.main(Excel_path)
    number_lines, wrong_counter = Excel_Tree.main(Excel_path, remove_h_items)
    correct_lines = number_lines - wrong_counter
    percentage = correct_lines / number_lines * 100
    rounded = round(percentage)

    text = (
        "("
        + str(correct_lines)
        + " / "
        + str(number_lines)
        + ") "
        + str(rounded)
        + "% - poprawnych"
    )
    return text


def phase_3_Tree(Excel_path, Tree_DWG_dir, Tree_PDF_dir):
    Excel_Tree.remove_colors(Excel_path)
    text = Excel_Tree.link_drowings(Excel_path, Tree_DWG_dir, Tree_PDF_dir)

    return text


def phase_4_tree(Excel_path):
    Excel_Tree.remove_colors(Excel_path)


def my_function():
    return "Hello from my_function!"
