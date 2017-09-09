module.exports = function(grunt) {
  var log = function (err, stdout, stderr, cb) {
    console.log(stdout);
    cb();
  }
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    builddir: 'assets',
    bootstrapdir: 'node_modules/bootstrap/',
    jquerydir: 'node_modules/jquery/dist',
    banner: '/*!\n' +
    ' * <%= pkg.name %> v<%= pkg.version %>\n' +
    ' * Homepage: <%= pkg.homepage %>\n' +
    ' * Copyright 2017-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    ' * Licensed under <%= pkg.license %>\n' +
    '*/\n',
    less: {
      dist: {
        options: {
          compress: false,
          strictMath: true
        },
        files: {}
      }
    },
    autoprefixer: {
      dist: {
        src: '*/main.css'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      js: {
        src: [
          '<%=jquerydir%>/jquery.js',
          'js/jquery-check.js',
          //'<%=bootstrapdir%>/js/transition.js',
          //'<%=bootstrapdir%>/js/alert.js',
          //'<%=bootstrapdir%>/js/button.js',
          //'<%=bootstrapdir%>/js/carousel.js',
          '<%=bootstrapdir%>/js/collapse.js', // Required by .navbar-collapse
          '<%=bootstrapdir%>/js/dropdown.js',
          //'<%=bootstrapdir%>/js/modal.js',
          //'<%=bootstrapdir%>/js/tooltip.js',
          //'<%=bootstrapdir%>/js/popover.js',
          //'<%=bootstrapdir%>/js/scrollspy.js',
          //'<%=bootstrapdir%>/js/tab.js',
          //'<%=bootstrapdir%>/js/affix.js'
        ],
        dest: '<%=builddir%>/js/main.js'
      }
    },
    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      js: {
        src: '<%= concat.js.dest %>',
        dest: '<%= builddir %>/js/main.min.js'
      }
    },
    clean: {
      assets: [
        'assets/js/*.js', '!assets/js/*.min.js',
        'assets/css/*.css', '!assets/css/*.min.css'
      ]
    },
    uncss: {
      dist: {
        options: {
          ignore: [
            // needed (no idea why it gets uncss-ed)
            '.main img.post-picture',
            // needed for Bootstrap's pager buttons
            /(#|\.)pager.*/,
            // needed for Bootstrap's transitions
            '.bs.carousel',
            '.slid.bs.carousel',
            '.slide.bs.carousel',
            '.fade',
            '.fade.in',
            '.collapse',
            '.collapse.in',
            '.collapsing',
            '.alert-danger',
            '.logged-in .navbar-default',
            /^\.carousel-inner.*/,
            '#float-toc',
            '#float-toc a',
            /^\.modal-.*/,
            '.modal.fade.in',
            /(#|\.)modal(\-[a-zA-Z]+)?/,
            '.navbar-toggle.open',
            '.fade .modal-dialog',
            '.logged-in .navbar-fixed-top',
            '.navbar-fixed-top',
            '/^\.navbar-collapse.*/',
            '.navbar-inverse .innovations.navbar-toggle.open',
            '.single-innovation .navbar-inverse .innovations.navbar-toggle.open',
            '#innovations.collapse.in',
            'ul.page-numbers li a.prev',
            '.open',
            '.open > .dropdown-menu',
            '.open > a',
            '.alert-danger',
            '.visible-xs',
            '.noscript-warning',
            '.close',
            '.alert-dismissible',
            '.page.calendar .events .panel:hover .fa-angle-down.open',
            '.fa-angle-down.open'
          ],
          stylesheets: ['assets/css/main.css'],
          htmlroot: './_site/',
          media: ['(min-width: 992px)', '(min-width: 768px)', '(max-width: 767px)']
        },
        files: {
          'assets/css/main.css': ['_site/*.html', '_site/*/*.html']
        }
      }
    },
    shell: {
      jekyll: {
        command: 'bundle exec jekyll build',
        options: {
          callback: log
        }
      },
      jekyll_incremental: {
        command: 'bundle exec jekyll build --incremental',
        options: {
          callback: log
        }
      }
    },
    watch: {
      less: {
        files: 'less/*.less',
        tasks: 'build-css',
        options: {
          nospawn: true
        }
      },
      jekyll_collections: {
        files: [
          '_recepty/*.md'
        ],
        tasks: 'shell:jekyll',
        options: {
          nospawn: true
        }
      },
      jekyll: {
        files: [
          '_config.yml',
          'index.md',
          '_layouts/*',
          '_posts/*',
          '_includes/*',
          '_pages/*',
          'assets/**'
        ],
        tasks: 'shell:jekyll_incremental',
        options: {
          livereload: true,
          nospawn: true
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watch: {
        tasks: ['watch:less', 'watch:jekyll_collections', 'watch:jekyll']
      }
    },
    connect: {
      base: {
        options: {
          base: '_site',
          port: 3000,
          livereload: true,
          open: true
        }
      },
      keepalive: {
        options: {
          port: 3000,
          livereload: true,
          keepalive: true,
          open: true
        }
      }
    }
  });

  grunt.registerTask('build-css', 'build css', function() {
    var lessDest = '<%=builddir%>/css/main.css';
    var files = {};
    files[lessDest] = 'less/main.less';
    grunt.config('less.dist.files', files);
    grunt.config('less.dist.options.compress', false);
    grunt.task.run([
      'less:dist',
      'prefix-css:' + lessDest,
      'compress-css:' + lessDest + ':<%=builddir%>/css/main.min.css'
    ]);
  });

  grunt.registerTask('prefix-css', 'autoprefix a generic css', function(fileSrc) {
    grunt.config('autoprefixer.dist.src', fileSrc);
    grunt.task.run('autoprefixer');
  });

  grunt.registerTask('compress-css', 'compress a generic css', function(fileSrc, fileDst) {
    var files = {};
    files[fileDst] = fileSrc;
    grunt.config('less.dist.files', files);
    grunt.config('less.dist.options.compress', true);
    grunt.task.run(['less:dist']);
  });

  grunt.registerTask('build', [
    'concat:js',
    'uglify:js',
    'build-css',
    'shell:jekyll',
    'uncss:dist',
    'compress-css:<%=builddir%>/css/main.css:<%=builddir%>/css/main.min.css',
    'clean:assets'
  ]);

  grunt.registerTask('serve', [
    'build',
    'connect:base',
    'concurrent:watch',
  ]);

  grunt.registerTask('default', 'serve');
};
