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





