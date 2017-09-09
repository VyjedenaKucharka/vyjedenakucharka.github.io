Vyjedena Kucharka - A cookbook (recipes in Czech only, sorry)
=============================================================

Deploying
---------

When editing in the browser, the website re-deploys automatically.

Otherwise, one needs to push to the repository using git:

    git push

After changing any javascript or less/css style files, the website has to be
rebuilt offline using grunt, see Developmental setup.

Developmental setup
-------------------

### Installs to compile js and less

1. Install nodejs + npm from ports (now: nodejs6, npm4)
   or use locally built nodejs (contains npm) on Debian/Linux
2. Install grunt-cli globally
    npm install -g grunt-cli
3. Install the rest locally using package.json
    npm install

### Installs to run jekyll

On MacOS, install recent ruby version from MacPorts (now: 2.4) and install the
rest locally:
    sudo port install ruby24 rb24-bundler
    bundle-2.4 install --path vendor/bundle
On Debian/Ubuntu:
    sudo apt-get install ruby ruby-bundler
    bundle install --path vendor/bundle

### Building the website

Running `grunt build` is enough to completely build the website inside `_site`
subdirectory.


### Github pages versions

[Dependencies and versions](https://pages.github.com/versions/)

### Developing

Running `grunt` (the default task) starts a local webserver on
http://0.0.0.0:3000/ with a live reload.

### Favicon

The favicon is generated from the `logo.svg` template using the [real favicon
generator](http://realfavicongenerator.net/).
