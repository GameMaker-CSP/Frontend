"""Adapt inherited root-relative URLs to a GitHub project site's base path.

Only generated files are changed. Paths must refer to an existing output file
or directory; API routes and external URLs therefore keep their original meaning.
Jekyll's already-prefixed relative_url output is left alone.
"""
import argparse
from pathlib import Path
import re
from urllib.parse import unquote

QUOTED_URL = re.compile(r'''(?P<quote>["'`])(?P<url>/(?!/)[^"'`\s<>)]*)(?P=quote)''')
CSS_URL = re.compile(r'''(?P<lead>\burl\(\s*)(?P<url>/(?!/)[^"'`\s<>()]*)(?P<end>\s*\))''')
EXTENSIONS = {'.html', '.js', '.css', '.json', '.webmanifest', '.svg'}


def prefix_urls(text, site, base_path):
    def prefix(url):
        if url == base_path or url.startswith(base_path + '/'):
            return url
        path = unquote(re.split(r'[?#]', url, maxsplit=1)[0]).lstrip('/')
        target = site / path
        # Extensionless Jekyll routes can also be emitted as route.html.
        if '..' in Path(path).parts or not (target.exists() or target.with_suffix('.html').is_file()):
            return url
        return base_path + url

    text = QUOTED_URL.sub(lambda m: m['quote'] + prefix(m['url']) + m['quote'], text)
    return CSS_URL.sub(lambda m: m['lead'] + prefix(m['url']) + m['end'], text)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('site', type=Path)
    parser.add_argument('base_path')
    args = parser.parse_args()
    base_path = '/' + args.base_path.strip('/')
    if base_path == '/':
        return
    if not args.site.is_dir():
        parser.error('site must be an existing generated output directory')
    changed = 0
    for path in args.site.rglob('*'):
        if path.is_file() and path.suffix in EXTENSIONS:
            original = path.read_text(encoding='utf-8')
            updated = prefix_urls(original, args.site, base_path)
            if updated != original:
                path.write_text(updated, encoding='utf-8')
                changed += 1
    print(f'Prefixed repository URLs in {changed} generated files.')


if __name__ == '__main__':
    main()
