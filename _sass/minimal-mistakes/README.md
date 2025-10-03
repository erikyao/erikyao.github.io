Since now I am using _minimal-mistakes_ gem (i.e. `gem "minimal-mistakes-jekyll"` in `Gemfile` and `theme: "minimal-mistakes-jekyll"` in `_config.yml`), to override the default styles, I should copy `.scss` files from the gem (instead of _minimal-mistakes_ Github repo) and then modify accordingly.

To locate my local _minimal-mistakes_ gem installation directory, run:

```bash
bundle show minimal-mistakes-jekyll
```