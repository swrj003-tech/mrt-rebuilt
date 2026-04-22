import os

def generate_map(output_file):
    exclude_dirs = {'.git', 'node_modules', 'dist', 'New folder', 'prisma'}
    exclude_files = {'package-lock.json', 'MRT_Map_v2.txt', 'MRT_Project_Code_Map.txt', 'products_dump.json', 'dev_output.log', 'tunnel_new.log', 'tunnel_output.log', 'tunnel_url.txt'}
    include_extensions = {'.html', '.js', '.css', '.json', '.cjs', '.ts'}

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# MRT International - Complete Project Code Map\n")
        f.write("## Project Overview\n")
        f.write("This document contains the complete file-by-file structure and source code for the MRT International Holding LLC e-commerce platform.\n\n")
        
        f.write("## Folder Structure\n")
        f.write("```\n")
        # Simplified folder listing
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            level = root.replace('.', '').count(os.sep)
            indent = ' ' * 4 * (level)
            f.write(f"{indent}+---{os.path.basename(root)}/\n")
            subindent = ' ' * 4 * (level + 1)
            for file in files:
                if file not in exclude_files and any(file.endswith(ext) for ext in include_extensions):
                    f.write(f"{subindent}|   {file}\n")
        f.write("```\n\n")

        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file not in exclude_files and any(file.endswith(ext) for ext in include_extensions):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, '.')
                    size = os.path.getsize(file_path)
                    
                    f.write("---\n\n")
                    f.write(f"## File: {file}\n")
                    f.write(f"**Path:** `{rel_path}`\n")
                    f.write(f"**Size:** {size} bytes\n")
                    
                    lang = 'text'
                    if file.endswith('.js'): lang = 'javascript'
                    elif file.endswith('.html'): lang = 'html'
                    elif file.endswith('.css'): lang = 'css'
                    elif file.endswith('.json'): lang = 'json'
                    
                    f.write(f"```{lang}\n")
                    try:
                        with open(file_path, 'r', encoding='utf-8') as cf:
                            f.write(cf.read())
                    except Exception as e:
                        f.write(f"ERROR READING FILE: {str(e)}")
                    f.write("\n```\n\n")

        f.write(f"---\n\n**Last Updated:** April 18, 2026\n")
        f.write("**Status**: Redesigned & Restored\n")

if __name__ == "__main__":
    generate_map("MRT_Project_Code_Map.txt")
    # Also update V2 for consistency
    import shutil
    shutil.copy("MRT_Project_Code_Map.txt", "MRT_Map_v2.txt")
    print("Map files regenerated successfully.")
