from pathlib import Path

curr_dir = Path(__file__).parent
main_dir = curr_dir.parent
code_dir = main_dir.parent
app_dir = code_dir.parent
BOM_dir =  app_dir / "BOM"
temp_dir = BOM_dir / "template"

def get_hashes(line):
    target_str = "xxxxxxxxxx,xxxxxxxxxx,xxxxxxxxxx,xxxxxxxxxx"
    if line.strip() == target_str:
        return True
    return False

def main():
    if temp_dir.exists():                                                               # select BOM file
        for file in temp_dir.iterdir():
            if file.is_file():
                bom_file = file
                print("bom_file: ", bom_file)

    with open(bom_file, "r", encoding='utf-8') as f:                                    # write lines from BOM file to lines
        lines = f.readlines()

        first_hash = 0
        second_hash = 0
        counter = 0
        for line in lines:                                                              # first and second XXXX lines
            if get_hashes(line):
                if first_hash == 0:
                    first_hash = counter
                else:
                    second_hash = counter
            counter += 1

        main_lines = lines[0: first_hash - 1]
        extension_lines = lines[first_hash + 2: second_hash - 1]

    return main_lines, extension_lines                                                      