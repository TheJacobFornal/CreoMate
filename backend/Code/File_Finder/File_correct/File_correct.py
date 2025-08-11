from pathlib import Path
from openpyxl import load_workbook
from openpyxl.styles import PatternFill

# from tabulate import tabulate


wrong_counter = 0
result = []


def check_correction(file_path, correctFileName):
    global result
    file_name = file_path.stem
    end = file_name.split("-")[-1]
    if any(char.isdigit() for char in end):
        result.append(file_name)
        if correctFileName:
            repair_fileName(file_path)


def repair_fileName(file_path):
    file_name = file_path.stem
    parts = file_name.split("-")

    if len(parts) == 3:
        base_name = parts[:2]
        base_name = base_name[0] + "-" + base_name[1]
        print("Base name:", base_name)

        end = parts[-1]
        correct_end = end[:1]

        corrected_name = str(base_name) + "-" + str(correct_end)

        rename_file(Path(file_path), corrected_name)


def rename_file(old_path, new_name):
    print(f"Renaming {old_path} to {new_name}")

    extension = old_path.suffix
    new_name = new_name + extension

    new_path = old_path.with_name(new_name)

    if new_path.exists():
        print(f"File {new_path} already exists. Skipping rename.")
        # old_path.unlink(missing_ok=True)

    # old_path.rename(new_path)


def main(folder, correctFileName=True):
    global result
    wrong_counter = 0
    result = []
    folder_path = Path(folder)

    for file in folder_path.iterdir():
        check_correction(file, correctFileName)

    print("table result:")

    print(result)

    return result


if __name__ == "__main__":
    folder_path = Path(r"C:\Users\JakubFornal\Downloads\EXPORT — kopia")

    main(folder_path)
