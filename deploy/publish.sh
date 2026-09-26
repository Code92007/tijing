#!/usr/bin/env bash
set -euo pipefail

repo_dir="${1:-/root/tijing}"
web_root="${2:-/root/tijing/public}"

install -d -m 0755 "$web_root"
install -m 0644 "$repo_dir/index.html" "$web_root/index.html"
install -m 0644 "$repo_dir/styles.css" "$web_root/styles.css"
install -m 0644 "$repo_dir/app.js" "$web_root/app.js"
install -m 0644 "$repo_dir/problem-set-export.js" "$web_root/problem-set-export.js"
install -m 0644 "$repo_dir/config.js" "$web_root/config.js"
install -m 0644 "$repo_dir/.nojekyll" "$web_root/.nojekyll"

echo "Published tijing static files to $web_root"
