from pathlib import Path
from openpyxl import load_workbook
from openpyxl.styles import PatternFill

# from tabulate import tabulate


wrong_counter = 0
filesToCorrection = []
filesUnchangedAble = []


def check_correction(file_path, correctFileName):
    global filesUnchangedAble, filesToCorrection
    file_name = file_path.stem

    parts = file_name.split("-")

    if not len(parts) == 3:
        filesUnchangedAble.append(file_name)
    else:
        end = file_name.split("-")[-1]
        if any(char.isdigit() for char in end):
            if end[1] == "_":  # DWG file like "f_3"
                if correctFileName:
                    repair_fileName(file_path)
                else:
                    filesToCorrection.append(file_name)
            else:
                filesUnchangedAble.append(file_name)


def repair_fileName(file_path):  # repair file name like "f_3" to "f"
    file_name = file_path.stem
    parts = file_name.split("-")

    base_name = parts[:2]
    base_name = base_name[0] + "-" + base_name[1]

    end = parts[-1]
    correct_end = end[:1]

    corrected_name = str(base_name) + "-" + str(correct_end)

    rename_file(Path(file_path), corrected_name)


def rename_file(old_path, new_name):
    print(f"Renaming {old_path} to {new_name}")
    extension = old_path.suffix
    new_name = new_name + extension

    new_path = old_path.with_name(new_name)

    old_path.rename(new_path)


def main(folder, correctFileName=True):
    global filesToCorrection, filesUnchangedAble
    wrong_counter = 0
    filesToCorrection = []
    filesUnchangedAble = []

    folder_path = Path(folder)

    for file in folder_path.iterdir():
        if file.suffix.lower() in (".dwg", ".pdf", ".stp"):
            check_correction(file, correctFileName)

    return filesToCorrection, filesUnchangedAble


if __name__ == "__main__":
    folder_path = Path(r"C:\Users\JakubFornal\Downloads\EXPORT — kopia")

    main(folder_path)
