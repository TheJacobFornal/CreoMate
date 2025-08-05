from openpyxl import load_workbook
from pathlib import Path
from openpyxl.styles import PatternFill
from Code.Excel_Check.Excel_Addision import Excel_addition

counter_wrong = 0
max_row = 0
min_row = 0

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
    global min_row
    global max_row
    global counter_wrong
    TypeIndex = 5
    for row in range(max_row, min_row, -1):                                                        
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




def check_type_creo_name(ws, row, creo):                                                               # check creo type at the end
    """ 
    IN: IL10_9-PROFIL_45X45L-H

    Checks if the last part of the string (after last '-') is a single letter 
    and that letter is one of 'H', 'L', or 'F'.
    """
    global counter_wrong
    
    creo_name = str(creo)
    
    if not creo_name or '-' not in creo_name:
        return False

    last_part = creo_name.split('-')[-1].strip()
    
    
    
    
    if not last_part in {'H', 'P', 'L', 'F', 'T', 'W', 'O', 'S', 'N', 'D', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6','H7', 'H8','H9', 'H10','H11', 'H12','H13', 'H14'} :
        print("last_part:", last_part, flush=True)
        counter_wrong += 1
        color_row(ws, row, True, "00FFB7") 

               


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
        
    
def check_Material_Obrobki_brak(ws, row):                                                           # Sprawdza czy materiału i obróbek wartość nie jest "Brak" lub "brak"
    Cieplna_index = 7
    Powierzchnia_index = 8

    Cieplna_cell = ws.cell(row, Cieplna_index)
    Powierzchnia_cell = ws.cell(row, Powierzchnia_index)

    if Cieplna_cell.value and str(Cieplna_cell.value).strip().lower() == "brak":                    # zmienia "Brak" na "Brak / None"
        ws.cell(row, Cieplna_index).value  = "Brak / None"
    if Powierzchnia_cell.value and Powierzchnia_cell.value.strip().lower() == "brak":
        ws.cell(row, Powierzchnia_index).value = "Brak / None"


def check_production(ws, row):                                                                         # Sprawdza części produkcyjne                                           
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
        
        
    
                
def highlight_repeated_in_column(ws, col):
    global max_row
    global min_row
    global counter_wrong
    """
        Highlights rows where values in column B are repeated.
        """
    value_count = {}
        
    # First pass: count occurrences
    for row in range(2, max_row): 
        typ = ws.cell(row, 5).value

        if typ in {'P', 'L', 'F', 'T', 'W', 'O', 'S', 'D'}:
            val = ws.cell(row, col).value
            if val in value_count:
                
                value_count[val].append(row)
            else:
                value_count[val] = [row]
    
     # Second pass: highlight rows with repeated values
    for rows in value_count.values():
        if len(rows) > 1:
            #
            for row in rows:
                color_row(ws, row, True, "DDD8B8")
                
        
        
def main_Tree(Excel_path):
    global counter_wrong
    global max_row
    global min_row
    
    deleated_counter = 0
    counter_wrong = 0
    producent_index = 6

    
    
    wb = load_workbook(Excel_path)
    ws = wb.active

    
    for row in range(ws.max_row, 0, -1):  # iterate from bottom to top
        creo_name = ws.cell(row, 2).value
        check_type_creo_name(ws, row, creo_name)
        if creo_name is None:
            continue
        type = creo_name.split('-')[-1]
        
        producent = ws.cell(row, producent_index).value
        
        
        if producent is not None:                             #usuwa ".kat"
            if producent.__contains__("kat."):
                producent = producent.replace("kat.", "")
            
            producent = producent.lower()    
            producent = producent.strip().capitalize()
            ws.cell(row, producent_index).value = producent
        
        if "H" in type or type == "N":
            print(type)
            if contain_num(type):                                           #H1, H2, H3
                print("Number in type: ", type)
                ws.delete_rows(row)
            else:
                if producent is None:                
                    color_row(ws, row, True)          
               
                    
                    
                
    wb.save(Excel_path)
            
def check_if_colored(cell):
    TAG_COLORS = {
        "00FFB7",  # Mint Aqua
        "FFFF00",  # Bright Yellow
        "FF0000",  # Red
        "F76700",  # Orange
        "ABA200",  # Olive
        "D3A6FF",  # Lavender Violet
        "00B0F0",  # Cyan Blue
        "A1887F",  # Light Brown / Taupe
        "B0BEC5",  # Cool Gray
        "FF3399",  # Hot Pink
        "42FF48",  # Neon Green
        "379392",  # Dark syjan
        "DDD8B8", # Sandy
    }

    fill = cell.fill
    if fill is None or fill.fill_type != 'solid':
        return False  # Not colored or no solid fill

    fg_color = fill.start_color.rgb
    if fg_color is None:
        return False

    # If color is ARGB (8 chars), get the last 6 (RGB)
    if len(fg_color) == 8:
        fg_color = fg_color[-6:]

    return fg_color.upper() not in TAG_COLORS


def main(Excel_path, removeHItems=False, Zakupy=False):
    global counter_wrong
    global max_row
    global min_row
    creo_index = 1
   
    counter_wrong = 0
    TypeIndex = 5
    wb = load_workbook(Excel_path)
    ws = wb.active
    max_row, min_row = Excel_addition.get_max_min_row(ws, Zakupy)
    remove_dash_Type(ws, removeHItems)
    print("Max row:", max_row, flush=True)
    print("Min row:", min_row, flush=True)

    highlight_repeated_in_column(ws, 2)
    
    for row in range(1, ws.max_row + 1):
        
        if not Zakupy:
            creo_name = ws.cell(row, creo_index).value
            check_type_creo_name(ws, row, creo_name)
            highlight_repeated_in_column(ws, 2)
        else:
            if not check_if_colored:
                highlight_repeated_in_column(ws, 2)
                
                
        Type_value = ws.cell(row, TypeIndex).value
        check_Material_Obrobki_brak(ws, row)

        if Type_value is not None:
            if Type_value == "H" or Type_value == "N":
                check_handlowe(ws, row)
            elif Type_value == "L" or Type_value == "F" or Type_value == "O" or Type_value == "W" or Type_value == "T" or Type_value == "D":
                check_production(ws, row)

    wb.save(Excel_path)

    return counter_wrong

        

