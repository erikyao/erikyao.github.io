source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "minimal-mistakes-jekyll"
gem "webrick", "~> 1.8"

gem "rake"
gem "tzinfo-data"
gem "wdm", "~> 0.1.0" if Gem.win_platform?

# See https://mmistakes.github.io/minimal-mistakes/docs/installation/#install-dependencies
# The following plugins are automatically loaded by the theme-gem:
#   gem "jekyll-paginate"
#   gem "jekyll-sitemap"
#   gem "jekyll-gist"
#   gem "jekyll-feed"
#   gem "jekyll-include-cache"
#
# If you have any other plugins, put them here!
# Cf. https://jekyllrb.com/docs/plugins/installation/

# Manually include plugins for precise version control
group :jekyll_plugins do
  gem "jemoji"
  gem "jekyll-algolia"
  # gem "jekyll-paginate-v2"  # new pagintion for > Jekyll 3.0
  gem "jekyll-paginate"   # default pagination (mainly for back-compactibility)
  
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jekyll-include-cache"

  # gem "jekyll-polyglot"  # i18n support
end