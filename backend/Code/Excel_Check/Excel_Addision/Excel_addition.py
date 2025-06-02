from openpyxl import load_workbook
from pathlib import Path
from openpyxl.styles import PatternFill


def remove_bg_color(ws):
    for row in ws.iter_rows():
        for cell in row:
            cell.fill = PatternFill(fill_type=None)

def main(Excel_path):
    if Excel_path.is_file():
        wb = load_workbook(Excel_path)
        ws = wb.active
        remove_bg_color(ws)

        wb.save(Excel_path)

def number_of_rows(Excel_path):
    if Excel_path.is_file():
        wb = load_workbook(Excel_path)
        ws = wb.active
        return ws.max_row
    return 0

def number_of_rows_drawings(Excel_path):
    if Excel_path.is_file():
        wb = load_workbook(Excel_path)
        ws = wb.active
        counter = 0
        print("Checking drawings...", flush=True)

        typeINdex = 5
        for row in range(1, ws.max_row + 1):
            type = ws.cell(row, typeINdex).value
            
            if type is not None and (type == "F" or type == "L" or type == "W" or type == "T" or type == "O" or type == "D"):
                print("Row: ", row, " Type: ", type, flush=True)
                counter += 1
        return counter
    return counter







