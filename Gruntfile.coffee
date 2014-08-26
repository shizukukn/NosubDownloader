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
                    'manifest.json'
                    '**/*.png'
                    '**/*.json'
                    '**/*.js'
                    '**/*.js.map'
                    ]
                dest: 'bin/NosubDownloader'
            
            bower:
                expand: true
                cwd: 'obj/NosubDownloader/'
                src: 'bower_concat.js'
                dest: 'bin/NosubDownloader/vendor/js/'
        
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
                    'NosubDownloader/vendor/*.js'
                    ]
                tasks: ['copy:main']
        
            bower:
                files: ['bower.json', 'bower_components/**/*']
                tasks: ['bower_concat', 'copy:bower']
    
    for t of pkg.devDependencies
        if t.substring(0, 6) is 'grunt-'
            grunt.loadNpmTasks t
    
    grunt.registerTask 'default', [
        'typescript'
        'bower_concat'
        'copy'
        'watch'
        ]
    
    grunt.registerTask 'build', [
        'typescript'
        'bower_concat'
        'copy:main'
        'uglify'
        'compress'
        ]