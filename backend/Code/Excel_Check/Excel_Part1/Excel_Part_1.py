from openpyxl import load_workbook
from pathlib import Path
from openpyxl.styles import PatternFill

counter_wrong = 0

def color_row(ws, row_num, type, color = "FFFF00"):
    if type:
        fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    else:
        fill = PatternFill(fill_type= None)
    for col in range(1, 10):
        ws.cell(row=row_num, column=col).fill = fill

def contain_num(text):
    return any(char.isdigit() for char in text)

def remove_dash_Type(ws, removeHItems):
    global counter_wrong
    TypeIndex = 5
    for row in range(ws.max_row, 0, -1):                # H1, H2, H3
        Type_value = ws.cell(row, TypeIndex).value
        if Type_value is not None and not Type_value.isdigit():
            color_row(ws, row, False)  # has Type
            removed_dash = Type_value.replace("-", "")
            ws.cell(row, TypeIndex).value = removed_dash

            if "H" in removed_dash and contain_num(removed_dash):
               
                if removeHItems:
                    ws.delete_rows(row)  
                else:
                    color_row(ws, row, True, "FFFF00")
                    counter_wrong += 1
                    #print("H in Type", flush=True)
                
        else:
            color_row(ws, row, True, "1A4D96")  # Empty type - light blue
            counter_wrong += 1  
            #print("Empty Type", flush=True)



def check_handlowe(ws, row):
    global counter_wrong
    Producent_index = 9                      # Producent
    Nazwa_index = 3
    Numer_index = 2

    Producent_cell = ws.cell(row, Producent_index)
    Nazwa_val = ws.cell(row, Nazwa_index).value
    Numer_val = ws.cell(row, Numer_index).value

    def_numer = "nr. katalogowy"
    def_nazwa = "nazwa katalogowa"
    def_producent = "Producent"

    if Nazwa_val and Nazwa_val.strip() == def_nazwa or  Numer_val and Numer_val.strip() == def_numer or Producent_cell and Producent_cell.value == def_producent:       #check czy default nazwy - nie uzupełnione relacje kol. B, C, I
        color_row(ws, row, True, "F76700")
        counter_wrong += 1
        #print("default nazwa", flush=True)
        return

    if not Producent_cell.value:                                                                     # nie ma producenta  - red
        color_row(ws, row, True, "FF0000")
        counter_wrong += 1
        #print("producent", ws.cell(row, 1), flush=True)
        
    else:
        color_row(ws, row, False)                                                               # jest producent - empty

def check_production(ws, row):
    global counter_wrong
    Material_index = 6
    Cieplna_index = 7
    Powierzchnia_index = 8

    Material_cell = ws.cell(row, Material_index)
    Cieplna_cell = ws.cell(row, Cieplna_index)
    Powierzchnia_cell = ws.cell(row, Powierzchnia_index)

    if not Material_cell.value or not Cieplna_cell.value or not Powierzchnia_cell.value:               # Produkiowane nie materiału i obróbek
        color_row(ws, row, True, "ABA200")
        counter_wrong += 1
        #print("produkownae material", flush=True)
    else:
        if Cieplna_cell.value.lower() == "brak":   # zmienia "Brak" na "Brak / None"
            ws.cell(row, Cieplna_index).value  = "Brak / None"
        elif Powierzchnia_cell.value.lower() == "brak":
            ws.cell(row, Powierzchnia_index).value = "Brak / None"
        color_row(ws, row, False)


def main(Excel_path, removeHItems=False):
    global counter_wrong
    counter_wrong = 0
    TypeIndex = 5
    wb = load_workbook(Excel_path)
    ws = wb.active
    remove_dash_Type(ws, removeHItems)

    for row in range(1, ws.max_row + 1):
        Type_value = ws.cell(row, TypeIndex).value

        if Type_value is not None:
            if Type_value == "H" or Type_value == "N":
                check_handlowe(ws, row)
            elif not Type_value.__contains__("H") and not Type_value.isdigit():
                check_production(ws, row)

    wb.save(Excel_path)

    return counter_wrong