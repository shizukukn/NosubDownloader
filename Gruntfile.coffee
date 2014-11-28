_ = require('./node_modules/grunt/node_modules/lodash')

module.exports = (grunt) ->
    pkg = grunt.file.readJSON 'package.json'
    
    webstore_upload = try
        grunt.file.readJSON '.webstore_upload.json'
    catch err
        {}
    
    grunt.initConfig
        bower_concat:
            main:
                dependencies:
                    'pgwmodal': 'zepto'
                    'knockout-es5-passy': ['knockoutjs', 'knockout-secure-binding']
                    'knockout-secure-binding': 'knockoutjs'
                mainFiles:
                    'pgwmodal': ['pgwmodal.js', 'pgwmodal.css']
                    'knockout-secure-binding': 'dist/knockout-secure-binding.js'
                exclude: ['jquery', 'bootstrap']
                dest: 'obj/' + pkg.name + '/bower_concat.js'
                cssDest: 'obj/' + pkg.name + '/bower_concat.css'
            
            bootstrap:
                include: ['bootstrap']
                dest: 'obj/' + pkg.name + '/bootstrap.js'
                cssDest: 'obj/' + pkg.name + '/bootstrap.css'
        
        copy:
            main:
                expand: true
                cwd: pkg.name + '/'
                src: [
                    '*.js'
                    'vendor/**/*.js'
                    '**/*.png'
                    '_locales/*/*.json'
                    '**/*.css'
                    '**/*.html'
                    ]
                dest: 'bin/' + pkg.name + '/'
            
            bower_js:
                expand: true
                cwd: 'obj/' + pkg.name + '/'
                src: '*.js'
                dest: 'bin/' + pkg.name + '/vendor/js/'
            
            bower_css:
                expand: true
                cwd: 'obj/' + pkg.name + '/'
                src: '*.css'
                dest: 'bin/' + pkg.name + '/vendor/css/'
            
            license:
                src: 'LICENSE.txt'
                dest: 'bin/' + pkg.name + '/'
       
        typescript:
            options:
                module: 'commonjs'
                target: 'es5'
                sourceMap: false
                declaration: false
                noImplicitAny: true
                comments: true
            main:
                src: [pkg.name + '/*.ts']
            all:
                src: [pkg.name + '/**/*.ts']
        
        less:
            main:
                options:
                    compress: true
                    cleancss: true
                    ieCompat: false
                
                files: [
                    expand: true
                    src: [pkg.name + '/**/*.less']
                    dest: ''
                    ext: '.css'
                ]
        
        compress:
            main:
                options:
                    archive: 'bin/' + pkg.name + '.zip'
                files: [
                    expand: true
                    cwd: 'bin'
                    src: [pkg.name + '/**/*']
                ]
        
        crx:
            main:
                src: 'bin/' + pkg.name + '/'
                dest: 'bin/' + pkg.name + '.crx'
                privateKey: '.build/secret/development.pem'
        
        uglify:
            vendor:
                expand: true
                cwd: pkg.name + '/vendor/js/'
                src: '*.js'
                dest: 'bin/' + pkg.name + '/vendor/js/'
            bower_concat:
                src: 'bin/' + pkg.name + '/vendor/js/bower_concat.js'
                dest: 'bin/' + pkg.name + '/vendor/js/bower_concat.js'
            bootstrap:
                src: 'bin/' + pkg.name + '/vendor/js/bootstrap.js'
                dest: 'bin/' + pkg.name + '/vendor/js/bootstrap.js'
            main_background:
                src: 'bin/' + pkg.name + '/background/js/background.js'
                dest: 'bin/' + pkg.name + '/background/js/background.js'
            main_content_scripts:
                src: 'bin/' + pkg.name + '/content_scripts/js/content_scripts.js'
                dest: 'bin/' + pkg.name + '/content_scripts/js/content_scripts.js'
            main_options_page:
                src: 'bin/' + pkg.name + '/options_page/js/options_page.js'
                dest: 'bin/' + pkg.name + '/options_page/js/options_page.js'
        
        json5_to_json:
            manifest:
                options:
                    replacer: null
                    space: 2
                src: [pkg.name + '/manifest.json']
                dest: 'bin/' + pkg.name + '/manifest.json'
        
        htmlhint:
            options:
                htmlhintrc: '.htmlhintrc'
            main:
                src: [pkg.name + '/**/*.html']
        
        webstore_upload: _.extend(webstore_upload,
            extensions:
                main:
                  appID: 'eelgfimjhklhlfboimiihlkbgefaacfp',
                  zip: 'bin/' + pkg.name + '.zip'
            )
        
        browserify:
            options:
                transform: ['typescriptifier', 'strictify', 'debowerify']
                browserifyOptions:
                    extensions: ['.ts']
            main_background:
                src: pkg.name + '/background/js/*.ts'
                dest: 'bin/' + pkg.name + '/background/js/background.js'
            main_content_scripts:
                src: pkg.name + '/content_scripts/js/*.ts'
                dest: 'bin/' + pkg.name + '/content_scripts/js/content_scripts.js'
            main_options_page:
                src: pkg.name + '/options_page/js/*.ts'
                dest: 'bin/' + pkg.name + '/options_page/js/options_page.js'
        
        clean:
            bin: ['bin/**/*']
            obj: ['obj/**/*']
        
        watch:
            main_browserify_background:
                files: [pkg.name + '/background/**/*.ts']
                tasks: ['browserify:main_background']
            main_browserify_content_scripts:
                files: [pkg.name + '/content_scripts/**/*.ts']
                tasks: ['browserify:main_content_scripts']
            main_browserify_options_page:
                files: [pkg.name + '/options_page/**/*.ts']
                tasks: ['browserify:main_options_page']
            
            main_typescript:
                files: [pkg.name + '/*.ts']
                tasks: ['typescript', 'copy:main']
            
            main_static:
                files: [
                    pkg.name + '/**/*.png'
                    pkg.name + '/_locales/*.json'
                    pkg.name + '/*.js'
                    pkg.name + '/vendor/**/*'
                    pkg.name + '/**/*.css'
                    pkg.name + '/**/*.html'
                    ]
                tasks: ['copy:main']
            
            bower:
                files: ['bower.json', 'bower_components/**/*']
                tasks: ['bower_concat', 'copy:bower', 'concat_css']
            
            manifest:
                files: [pkg.name + '/manifest.json']
                tasks: ['json5_to_json']
    
    require('load-grunt-tasks')(grunt)
    
    grunt.registerTask 'default', [
        'clean'
        'htmlhint'
        'typescript:main'
        'browserify'
        'less'
        'bower_concat'
        'copy'
        'json5_to_json'
        'watch'
        ]
    
    grunt.registerTask 'build', [
        'clean'
        'htmlhint'
        'typescript'
        'browserify'
        'less'
        'bower_concat'
        'copy'
        'json5_to_json'
        'create_empty_debug'
        'uglify'
        'compress'
        ]
    
    grunt.registerTask 'test', [
        'build'
        'crx'
        ]
    
    grunt.registerTask 'create_empty_debug', ->
        grunt.file.write('bin/' + pkg.name + '/debug.js', '')