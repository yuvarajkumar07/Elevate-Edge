import os
import shutil
import re

html_files = ['about.html', 'services.html', 'projects.html', 'contact.html']

for file in html_files:
    if not os.path.exists(file):
        continue
    
    # Create directory name by stripping .html
    dir_name = file.replace('.html', '')
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    
    # Read the file
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update asset paths to go up one directory
    content = content.replace('href="css/', 'href="../css/')
    content = content.replace('src="js/', 'src="../js/')
    content = content.replace('src="img/', 'src="../img/')
    content = content.replace('data-setbg="img/', 'data-setbg="../img/')
    
    # Update logo specifically since it might be absolute
    content = content.replace('src="/img/', 'src="../img/')
    
    # Update Navigation links to go up one directory
    # E.g. href="about" -> href="../about"
    content = re.sub(r'href="(about|services|projects|contact)"', r'href="../\1"', content)
    
    # Root link
    content = content.replace('href="/"', 'href="../"')
    content = content.replace('href="./index.html"', 'href="../"')
    
    # Save as index.html inside the new directory
    with open(os.path.join(dir_name, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Migrated {file} to {dir_name}/index.html")

print("Migration completed!")
