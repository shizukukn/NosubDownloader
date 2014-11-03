_ = require('./bower_components/underscore')

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
                    'async': 'lib/async.js'
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
                    'debug.js'
                    '**/*.png'
                    '**/*.json'
                    '**/*.js'
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
            main:
                src: [pkg.name + '/**/*.ts']
                options:
                    target: 'es5'
                    sourceMap: false
                    declaration: false
                    noImplicitAny: false
                    comments: true
        
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
                
        uglify:
            bower_main:
                src: 'obj/' + pkg.name + '/bower_concat.js'
                dest: 'bin/' + pkg.name + '/vendor/js/bower_concat.js'
                options:
                    sourceMap: false
            bower_bootstrap:
                src: 'obj/' + pkg.name + '/bootstrap.js'
                dest: 'bin/' + pkg.name + '/vendor/js/bootstrap.js'
                options:
                    sourceMap: false
            
            md5:
                src: pkg.name + '/vendor/js/md5.js'
                dest: 'bin/' + pkg.name + '/vendor/js/md5.js'
        
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
        
        clean:
            bin: ['bin/**/*']
            obj: ['obj/**/*']
        
        watch:
            main_static:
                files: [
                    pkg.name + '/**/*.png'
                    pkg.name + '/_locales/*.json'
                    pkg.name + '/debug.js'
                    pkg.name + '/**/*.js'
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
        'typescript'
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
        'less'
        'bower_concat'
        'copy:main'
        'copy:license'
        'copy:bower_css'
        'json5_to_json'
        'create_empty_debug'
        'uglify'
        'compress'
        ]
    
    grunt.registerTask 'test', [
        'build'
        ]
    
    grunt.registerTask 'create_empty_debug', ->
        grunt.file.write('bin/' + pkg.name + '/debug.js', '')