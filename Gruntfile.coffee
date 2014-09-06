module.exports = (grunt) ->
    pkg = grunt.file.readJSON 'package.json'
    
    grunt.initConfig
        bower_concat:
            main:
                dest: 'obj/NosubDownloader/bower_concat.js'
        
        copy:
            main:
                expand: true
                cwd: 'NosubDownloader/'
                src: [
                    'debug.js'
                    '**/*.png'
                    '**/*.json'
                    '**/*.js'
                    ]
                dest: 'bin/NosubDownloader'
            
            bower:
                expand: true
                cwd: 'obj/NosubDownloader/'
                src: 'bower_concat.js'
                dest: 'bin/NosubDownloader/vendor/js/'
            
            license:
                src: 'LICENSE.txt'
                dest: 'bin/NosubDownloader/'
        
        typescript:
            main:
                src: ['NosubDownloader/**/*.ts']
                options:
                    target: 'es5'
                    sourceMap: false
                    declaration: false
                    noImplicitAny: true
                    comments: true
        
        compress:
            main:
                options:
                    archive: 'bin/NosubDownloader.zip'
                files: [
                    expand: true
                    cwd: 'bin'
                    src: 'NosubDownloader/**/*'
                ]
                
        uglify:
            bower:
                src: 'obj/NosubDownloader/bower_concat.js'
                dest: 'bin/NosubDownloader/vendor/js/bower_concat.js'
                options:
                    sourceMap: false
            
            md5:
                src: 'NosubDownloader/vendor/js/md5.js'
                dest: 'bin/NosubDownloader/vendor/js/md5.js'
        
        json5_to_json:
            manifest:
                options:
                    replacer: null
                    space: 2
                src: ['NosubDownloader/manifest.json']
                dest: 'bin/NosubDownloader/manifest.json'
        
        watch:
            main_typescript:
                files: [
                    'tsd.json'
                    'typings/**/*'
                    'NosubDownloader/**/*.ts'
                    ]
                tasks: ['typescript', 'copy:main']
            
            main_static:
                files: [
                    'NosubDownloader/**/*.png'
                    'NosubDownloader/manifest.json'
                    'NosubDownloader/debug.js'
                    'NosubDownloader/vendor/*.js'
                    ]
                tasks: ['copy:main']
            
            bower:
                files: ['bower.json', 'bower_components/**/*']
                tasks: ['bower_concat', 'copy:bower']
            
            manifest:
                files: ['NosubDownloader/manifest.json']
                tasks: ['json5_to_json']
    
    require('load-grunt-tasks')(grunt)
    
    grunt.registerTask 'default', [
        'typescript'
        'bower_concat'
        'copy'
        'json5_to_json'
        'watch'
        ]
    
    grunt.registerTask 'build', [
        'typescript'
        'bower_concat'
        'copy:main'
        'copy:license'
        'json5_to_json'
        'create_empty_debug'
        'uglify'
        'compress'
        ]
    
    grunt.registerTask 'test', [
        'build'
        ]
    
    grunt.registerTask 'create_empty_debug', ->
        grunt.file.write('bin/NosubDownloader/debug.js', '')