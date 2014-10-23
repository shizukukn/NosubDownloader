module.exports = (grunt) ->
    pkg = grunt.file.readJSON 'package.json'
    
    grunt.initConfig
        bower_concat:
            main:
                dependencies:
                    'pgwmodal': 'zepto'
                mainFiles:
                    'pgwmodal': 'pgwmodal.js'
                dest: 'obj/' + pkg.name + '/bower_concat.js'
        
        concat_css:
            bower:
                src: ['bower_components/**/*.css']
                dest: 'bin/' + pkg.name + '/vendor/css/bower_concat.css'
        
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
            
            bower:
                expand: true
                cwd: 'obj/' + pkg.name + '/'
                src: 'bower_concat.js'
                dest: 'bin/' + pkg.name + '/vendor/js/'
            
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
                    noImplicitAny: true
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
            bower:
                src: 'obj/' + pkg.name + '/bower_concat.js'
                dest: 'bin/' + pkg.name + '/vendor/js/bower_concat.js'
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
        'typescript'
        'less'
        'bower_concat'
        'copy'
        'json5_to_json'
        'concat_css'
        'watch'
        ]
    
    grunt.registerTask 'build', [
        'clean'
        'typescript'
        'less'
        'bower_concat'
        'copy:main'
        'copy:license'
        'json5_to_json'
        'concat_css'
        'create_empty_debug'
        'uglify'
        'compress'
        ]
    
    grunt.registerTask 'test', [
        'build'
        ]
    
    grunt.registerTask 'create_empty_debug', ->
        grunt.file.write('bin/' + pkg.name + '/debug.js', '')