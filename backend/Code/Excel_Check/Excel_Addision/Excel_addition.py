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

def number_of_rows(Excel_path, Zakupy=False):
    if Excel_path.is_file():
        wb = load_workbook(Excel_path)
        ws = wb.active
        counter = 0
        if Zakupy:
            number_index = 2
            for row in range(5, 600):
                value = ws.cell(row, number_index).value
                if value not in ("", None):
                    counter += 1
            return counter
        else:
            return ws.max_row
    return 0


def number_of_rows_drawings(Excel_path):
    if Excel_path.is_file():
        wb = load_workbook(Excel_path)
        ws = wb.active
        counter = 0
        typeINdex = 5
        for row in range(1, ws.max_row + 1):
            type = ws.cell(row, typeINdex).value
            
            if type is not None and (type == "F" or type == "P" or type == "S" or type == "L" or type == "W" or type == "T" or type == "O" or type == "D"):
               
                counter += 1
        return counter
    return counter


def get_max_min_row(ws, zakupy=False):
    global max_row
    global min_row
    max_row = 0
    min_row = 0
    for row in ws.iter_rows(min_row=5, max_col=2, values_only=True):
        if row[1] is not None:
            max_row += 1
    if zakupy:
        max_row += 4
        min_row = 5
    else:
        min_row = 2
        max_row = ws.max_row
    return max_row, min_row







