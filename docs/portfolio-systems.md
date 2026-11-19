# Portfolio systems integration

This branch imports the seven systems from Open-Coding-Society/portfolio at
`990a05b49add260340e8408017186d4a89d2abe9`: Blogs, Calendar, Login, Messages, Profile,
Scraper, and Topics. Their source lives in `_projects/systems/`. The merge
does not replace UESL content, navigation, styles, build scripts, or deployment
configuration. Portfolio's course content and games are not part of this import.

## Run the local preview

```sh
export BUNDLE_GEMFILE=Gemfile.local
bundle install
bundle exec jekyll serve \
  --config _config.yml,_config.local.yml,_config.portfolio-preview.yml
```

Open <http://127.0.0.1:4700/portfolio-systems/>. Calendar, Messages, Topics,
Blogs, and Scraper have preview pages. The production build does not load the
preview config. Portfolio Login and Profile are included as source only:
**do not run their distribution manifests against this checkout**. They target
files that UESL already uses.

Calendar and Scraper need a compatible Portfolio Spring API. Messages also
uses a Portfolio chat socket, and its group-formation feature uses Portfolio
Flask. Configure those addresses in `_config.portfolio-preview.yml` and sign
into those services separately. The front-end repository does not supply
those backends, and the current UESL endpoints are not used as substitutes.
Topics and Blogs index the existing UESL content without moving it.

Run the preview build checks with:

```sh
BUNDLE_GEMFILE=Gemfile.local bundle exec ruby tests/portfolio_preview_test.rb
```

Some upstream tests target the original Portfolio checkout rather than UESL.
For example, the Login distribution and navbar tests expect Portfolio's
account pages and shared preferences modules to be installed.
