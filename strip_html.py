import os, re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to replace href="page.html" with href="page"
    content = re.sub(r'href="(about|contact|services|projects)\.html"', r'href="\1"', content)
    content = re.sub(r'href="\.\/(about|contact|services|projects)\.html"', r'href="\1"', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Stripped .html from hrefs in {len(html_files)} HTML files.")
