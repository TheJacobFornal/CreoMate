import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path
from openpyxl import load_workbook
import csv
from itertools import zip_longest
import pandas as pd
import re


def clean_illegal_chars(val):
    if isinstance(val, str):
        return re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F]', '', val)
    return val

def main(main_lines, extension_lines, Excel_path, readyBom_path):
    combined_lines = []
    space = "                              `                                 `                               `                           `"

    i = 0
    for main, ext in zip_longest(main_lines, extension_lines):
        new_line = (main.strip() if main else space) + (ext.strip() if ext else " ") + "\n"
        i = i + 1
        combined_lines.append(new_line)


    with open(readyBom_path, "w", encoding="utf-8") as f:
        f.writelines(combined_lines)

    with open(readyBom_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # First line is the header
    header = [col.strip() for col in lines[0].split('`')]
    rows = []

    for line in lines[1:]:
        # Use csv reader to correctly parse quoted commas
        parsed_row = [col.strip() for col in line.split('`')]
        cleaned_row = [col.strip() for col in parsed_row]
        rows.append(cleaned_row)

    df = pd.DataFrame(rows, columns=header)

    # Clean illegal Excel characters
    df = df.applymap(clean_illegal_chars)

    # Save to Excel
    df.to_excel(Excel_path, index=False)

    wb = load_workbook(Excel_path)
    ws = wb.active

    for column in ws.columns:
        max_length = 0
        col = column[0].column_letter
        for cell in column:
            try:
                if cell.value:
                    max_length = max(max_length, len(cell.value.strip()))               # SETTING COLUMN WIDTH
                    if isinstance(cell.value, str):                             # REMOVING SPACES FROM SIDEES OF CELL
                        cell.value = cell.value.strip()
            except:
                pass

            adjustment_width = max_length + 2
            ws.column_dimensions[col].width = adjustment_width

    last_col = ws.max_column
    ws.delete_cols(last_col)

    for row in ws.iter_rows(min_row=2):  # skip header
        cell = row[3]  # colum D = ILOSC
        try:
            value = int(cell.value)
            cell.value = value
        except (ValueError, TypeError):
            pass

    wb.save(Excel_path)


