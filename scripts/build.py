import re
import subprocess
from pathlib import Path
import jinja2


print("[STEP 1/3] - Build React App")
subprocess.Popen(['npm', 'run', 'build'], cwd="./frontend").wait()


print("[STEP 2/3] - Copying React files to Python package")
# Cleanup static and templates
STATIC_FOLDER = 'airflow/plugins/dag_builder/static/'
TEMPLATES_FOLDER = 'airflow/plugins/dag_builder/templates/dag_builder'
subprocess.Popen(['rm', '-rf', STATIC_FOLDER]).wait()
subprocess.Popen(['rm', '-rf', f"{TEMPLATES_FOLDER}/*"]).wait()

# Copy new static
subprocess.Popen(['cp', '-r', 'frontend/build/static', STATIC_FOLDER]).wait()

# Generate build.html
index_html = Path("frontend/build/index.html").read_text()
js_id, css_id = re.findall(r"(?<=\.)[a-zA-Z0-9\.-]*(?=\.)", index_html)
environment = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath="scripts/templates"))
template = environment.get_template("builder.html.jinja")
build_html = template.render(js_id=js_id, css_id=css_id)
with open(f'{TEMPLATES_FOLDER}/builder.html', 'w') as f:
    f.write(build_html)

print("[STEP 3/3] - Build package")
# TODO
