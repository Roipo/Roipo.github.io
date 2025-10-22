import os
import re

def rename_folders(directory):
    for folder_name in os.listdir(directory):
        # Check if it is a directory
        folder_path = os.path.join(directory, folder_name)
        if os.path.isdir(folder_path):
            # Skip if it's already in the correct format (starts with 4-digit year)
            if re.match(r'^\d{4}-', folder_name):
                continue
            
            # Try to split the folder name into author, year, and title
            try:
                parts = folder_name.split("-", 2)
                if len(parts) >= 3:
                    author, year, title = parts
                    # Only rename if year is a 4-digit number
                    if re.match(r'^\d{4}', year):
                        new_folder_name = f"{year}-{author}-{title}"
                        
                        # Rename the folder
                        old_path = os.path.join(directory, folder_name)
                        new_path = os.path.join(directory, new_folder_name)
                        os.rename(old_path, new_path)
                        
                        print(f"Renamed folder '{folder_name}' to '{new_folder_name}'")
            except:
                print(f"Skipping folder '{folder_name}' - doesn't match expected format")

# Provide the path of the directory containing the folders
directory_path = r"C:\Dropbox\starter-hugo-academic\content\publication"

# Call the function to rename the folders
rename_folders(directory_path)