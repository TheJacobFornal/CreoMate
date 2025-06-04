from openpyxl import load_workbook
from pathlib import Path
from openpyxl.styles import PatternFill
import re

counter_wrong = 0

def contains_exactly_one_letter(s):
    letters = re.findall(r'[A-Za-z]', s)
    return len(letters) == 1

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
    for row in range(ws.max_row, 1, -1):                                                        
        Type_value = ws.cell(row, TypeIndex).value
        if Type_value is not None:
            Type_value = str(Type_value).strip()  
                                                              
        if Type_value is not None and not str(Type_value).isdigit():        # jakiś poprawny TYP (z H1, H2)

            removed_dash = Type_value.replace("-", "")
            ws.cell(row, TypeIndex).value = removed_dash

            if "H" in removed_dash and contain_num(removed_dash):                                             # H1, H2, H3, H4, H5, H6 - yellow                                                                               
               
                if removeHItems:
                    ws.delete_rows(row) 
                    continue 
                else:
                    color_row(ws, row, True, "FFFF00")                                             
                    counter_wrong += 1
                    continue

            if len(removed_dash) > 1:
                color_row(ws, row, True, "00FFB7")                                                           # Brak Type / Błędny Typ - light blue
                counter_wrong += 1  

                   
        else:
            color_row(ws, row, True, "00FFB7")                                                           # Brak Type / Błędny Typ - light blue
            counter_wrong += 1  
           


def check_handlowe(ws, row):            # Sprawdza części handlowe
    global counter_wrong
    Producent_index = 9                     
    Nazwa_index = 3
    Numer_index = 2

    Producent_cell = ws.cell(row, Producent_index)
    Nazwa_val = ws.cell(row, Nazwa_index).value
    Numer_val = ws.cell(row, Numer_index).value

    def_numer = "nr. katalogowy"
    def_nazwa = "nazwa katalogowa"
    def_producent = "Producent"

    if Nazwa_val and str(Nazwa_val).strip() == def_nazwa or  Numer_val and str(Numer_val).strip() == def_numer or Producent_cell and Producent_cell.value == def_producent:       #Check czy default nazwy - nie uzupełnione relacje kol. B, C, I
        color_row(ws, row, True, "F76700")
        counter_wrong += 1
        return

    if not Producent_cell.value:                                                                     # nie ma Producenta  - red
        color_row(ws, row, True, "FF0000")
        counter_wrong += 1
        
    
def check_Material_Obrobki_brak(ws, row):                            # Sprawdza czy materiału i obróbek wartość nie jest "Brak" lub "brak"
    Cieplna_index = 7
    Powierzchnia_index = 8

    Cieplna_cell = ws.cell(row, Cieplna_index)
    Powierzchnia_cell = ws.cell(row, Powierzchnia_index)

    if Cieplna_cell.value and str(Cieplna_cell.value).strip().lower() == "brak":                    # zmienia "Brak" na "Brak / None"
        ws.cell(row, Cieplna_index).value  = "Brak / None"
    if Powierzchnia_cell.value and Powierzchnia_cell.value.strip().lower() == "brak":
        ws.cell(row, Powierzchnia_index).value = "Brak / None"




def check_production(ws, row):                                                                          # Sprawdza części produkcyjne                                           
    global counter_wrong
    Material_index = 6
    Cieplna_index = 7
    Powierzchnia_index = 8

    Material_cell = ws.cell(row, Material_index)
    Cieplna_cell = ws.cell(row, Cieplna_index)
    Powierzchnia_cell = ws.cell(row, Powierzchnia_index)

    if not Material_cell.value or not Cieplna_cell.value or not Powierzchnia_cell.value:               # Produkiowane nie materiału i obróbek - oliwkowy
        color_row(ws, row, True, "ABA200")                                          
        counter_wrong += 1

def main(Excel_path, removeHItems=False, Zakupy=False):
    global counter_wrong
    counter_wrong = 0
    TypeIndex = 5
    wb = load_workbook(Excel_path)
    ws = wb.active
    remove_dash_Type(ws, removeHItems)

    for row in range(2, ws.max_row + 1):
        Type_value = ws.cell(row, TypeIndex).value
        check_Material_Obrobki_brak(ws, row)

        if Type_value is not None:
            if Type_value == "H" or Type_value == "N":
                check_handlowe(ws, row)
            elif Type_value == "L" or Type_value == "F" or Type_value == "O" or Type_value == "W" or Type_value == "T":
                check_production(ws, row)

    wb.save(Excel_path)

    return counter_wrong