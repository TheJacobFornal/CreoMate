from pathlib import Path
from openpyxl import load_workbook
from openpyxl.styles import PatternFill

wrong_counter = 0

def color_row(ws, row_num, type, color = "FFFF00"):
    if type:
        fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    else:
        fill = PatternFill(fill_type= None)
    for col in range(1, 10):
        ws.cell(row=row_num, column=col).fill = fill

def check_if_spawane_00(name):
    name = name.split("_")[1]
    name = str(name.split("-")[0])

    if name[-2:] == "00":
        print("spawane: ", name)
        return True
    else:
        return False

def check_dir(creo_name, row, ws, drowings_dir):
    global wrong_counter    
    path = drowings_dir / creo_name
    if not path.is_dir():
        color_row(ws, row, True, "F8DF00")      # yellow
        wrong_counter += 1
    else:
        color_row(ws, row, False)




def get_creo_name(ws, drowings_dir):
    global wrong_counter
    Typ_index = 5
    Creo_index = 1
    for row in range(1, ws.max_row + 1):
        Typ_value = ws.cell(row, Typ_index).value
        if Typ_value == "F" or Typ_value == "L" or Typ_value == "W" or Typ_value == "T" or Typ_value == "O" or Typ_value == "D":
            creo_name = ws.cell(row, Creo_index).value
            if check_if_spawane_00(creo_name):
                check_dir(creo_name, row, ws, drowings_dir)
            else:
                check_elem(creo_name, row, ws, drowings_dir)


def check_elem(creo_name, row, ws, drowings_dir):                                 #check if file exist in dir (elem)
    global wrong_counter
    pdf_name = creo_name + ".pdf"                               #pdf file
    file_path_pdf = drowings_dir / pdf_name

    bool = False

    if not file_path_pdf.exists():
        color_row(ws, row, True, "00B0F0")         
        bool = True
        wrong_counter += 1
    else:
        color_row(ws, row, False)


    stp_name = creo_name + ".stp"                               #stp file
    file_path_stp = drowings_dir / stp_name
    if not file_path_stp.exists():
        color_row(ws, row, True, "00B0F0")         
        if not  bool:
            wrong_counter += 1
            bool = True
    else:
        color_row(ws, row, False)

    dwg_name = creo_name + ".dwg"                               #dwg file
    file_path_dwg = drowings_dir / dwg_name
    if not file_path_dwg.exists():
        color_row(ws, row, True,  "00B0F0")         
        if not bool:
            wrong_counter += 1
    else:
        color_row(ws, row, False)

def main(Excel_path, folder):
    global wrong_counter
    wrong_counter = 0
    wb = load_workbook(Excel_path)
    ws = wb.active
    drowings_dir = Path(folder)
    get_creo_name(ws, drowings_dir)

    wb.save(Excel_path)
    return wrong_counter