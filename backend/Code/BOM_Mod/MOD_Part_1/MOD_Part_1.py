from pathlib import Path

def get_hashes(line):
    target_str = "xxxxxxxxxx,xxxxxxxxxx,xxxxxxxxxx,xxxxxxxxxx"
    return line.strip() == target_str

def main(bom_file):
    with open(bom_file, "r", encoding='utf-8') as f:
        lines = f.readlines()

        first_hash = 0
        second_hash = 0
        counter = 0
        
        for line in lines:
            if get_hashes(line):
                if first_hash == 0:
                    first_hash = counter
                else:
                    second_hash = counter
            counter += 1

        main_lines = lines[0: first_hash - 1]
        extension_lines = lines[first_hash + 2: second_hash - 1]
 
    return main_lines, extension_lines
