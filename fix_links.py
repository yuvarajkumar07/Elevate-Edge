import os, re
for f in os.listdir('.'):
    if f.endswith('.html'):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        content = re.sub(r'href="about"', 'href="about.html"', content)
        content = re.sub(r'href="services"', 'href="services.html"', content)
        content = re.sub(r'href="projects"', 'href="projects.html"', content)
        content = re.sub(r'href="contact"', 'href="contact.html"', content)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
print('Done!')
