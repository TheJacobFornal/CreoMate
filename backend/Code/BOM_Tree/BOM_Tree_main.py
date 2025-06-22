import pathlib



def remove_last_comma(line):
    return line[:-1]

def remove_first_comma(line):
    return line[1:]


def parse_fixed_width_line(line):
    # Extract fixed-width fields
    field1 = line[1:33].strip()
    field2 = line[35:67].strip()
    field3 = line[69:108].strip()
    field4 = line[110:114].strip()
    field5 = line[117:142].strip()
    return field1, field2, field3, field4, field5

def merge_two_lines(curr_result, next_lines_table):
    next_line = next_lines_table[0]
    next_result = parse_fixed_width_line(next_line)
    
    for i in range(0, 5):
        print(i + 1, next_result[i])
        if next_result[i].strip() != "":
            print("next_result", next_result[i])
            print("curr_result_tabel", curr_result[i + 1])
            curr_result[i] = curr_result[i].strip() + " " + next_result[i].strip()
            print("połaczone: ", curr_result[i])
    
    
    return curr_result

def format_row_to_fixed_width(row):
    widths = [35, 33, 38, 5, 26]

    padded_fields = [row[i].strip().ljust(widths[i]) for i in range(min(len(row), len(widths)))]

    return ', '.join(padded_fields)

def mod_long_name(lines):
    for i in range(len(lines) - 1):
        curr_line = lines[i]
        curr_line_table = curr_line.split(",") 
        
        if len(curr_line) == 1:
            continue

        curr_line = remove_last_comma(curr_line)
        curr_line = remove_first_comma(curr_line)

        next_line = lines[i + 1]
        next_line_table = next_line.split(",") 
        next_result = remove_first_comma(next_line)

        if 1 < len(next_line_table) < 4:
            curr_result = list(parse_fixed_width_line(curr_line))
            next_result = list(parse_fixed_width_line(next_line))

            for j in range(5):
                print(j + 1, curr_result[j])

            print(" ")    
            for j in range(5):
                print(j + 1, next_result[j])

            print(" ")
            print("curr_result_before: ", curr_result)

            curr_line_table = merge_two_lines(curr_result, next_line_table)

            print(" ")
            print(curr_line_table)

            curr_line = format_row_to_fixed_width(curr_line_table)

            print("curr_line: ", curr_line)
            print(next_line_table)
            print(" ")

        
                    
        

def main(BOM_path = r"C:\Users\JakubFornal\Downloads\tree_1.txt", Excel_path = r"C:\Users\JakubFornal\Desktop\CreoMate\BOM CreoMate.xlsx"):
    print(BOM_path, Excel_path)
    BOM_ready = r"C:\Users\JakubFornal\Downloads\tree_ready.txt"
    curr_line = []
    with open(BOM_path, "r", encoding='utf-8') as f:
        lines = f.readlines()
        for i in range(0, len(lines) - 1):
            if not lines[i].__contains__("Assembly"):                                                 # not include header
                    curr_line = lines[i]
                    
                                 
    curr_line = mod_long_name(lines)
    
    with open(BOM_ready, "w", encoding="utf-8") as f:
        f.writelines(curr_line)
                    
    
    
if __name__ == "__main__":
    main()