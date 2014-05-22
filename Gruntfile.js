'use strict';
module.exports = function (grunt) {

    // load all grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var cfg = {
        srcDir: 'source',
        buildDir: 'dist',
        demoDir: 'demo'
    };

    // project configuration
    grunt.initConfig({
        cfg: cfg,

        // watch
        watch: {
            livereload: {
                files: [
                    '<%= cfg.demoDir %>/**/*.js',
                    '<%= cfg.demoDir %>/**/*.css',
                    '<%= cfg.demoDir %>/**/*.html',
                    '!<%= cfg.buildDir %>/*.js',
                    '!<%= cfg.demoDir %>/dist/*.js',
                    '!<%= cfg.demoDir %>/bower_components/**/*'
                ],
                options: {
                    livereload: true
                }
            },
            build: {
                files: [
                    '<%= cfg.srcDir %>/**/*.js',
                    '!<%= cfg.buildDir %>/*.js'
                ],
                tasks: ['jshint:source', 'clean:build', 'closure-compiler:build', 'copy']
            }
        },

        // clean up files as part of other tasks
        clean: {
            build: {
                src: ['<%= cfg.buildDir %>/**']
            },
            demo: {
                src: ['<%= cfg.demoDir %>/dist/**']
            }
        },

        // prepare files for demo
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: ['<%= cfg.buildDir %>/*.*'],
                        dest: '<%= cfg.demoDir %>/'
                    },
                    {
                        expand: true,
                        src: ['css/*.*'],
                        dest: '<%= cfg.demoDir %>/'
                    }
                ]
            }
        },

        jshint: {
            options: {
                'jshintrc': true,
                reporter: require('jshint-stylish')
            },
            source: {
                files: {
                    src: ['<%= cfg.srcDir %>/**/*.js']
                }
            },
            demo: {
                files: {
                    src: [
                        '<%= cfg.demoDir %>/**/*.js',
                        '!<%= cfg.demoDir %>/bower_components/**/*'
                    ]
                }
            }
        },

        'closure-compiler': {
            build: {
                js: '<%= cfg.srcDir %>/**/*.js',
                closurePath: '.',
                maxBuffer: 500,
                trace: true,
                noreport: true,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    summary_detail_level: 1
                },
                jsOutputFile: '<%= cfg.buildDir %>/jquery.tooltipster.min.js'
            }
        },

        // connect
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: '0.0.0.0'
            },
            demo: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '')
                        ];
                    }
                }
            }
        },
        // open
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>/<%= cfg.demoDir %>/'
            }
        },
        compass: {

            compile_min: {
                options: {
                    sassDir: 'sass/min',
                    cssDir: 'css',
                    appDir: '.',
                    raw: "Encoding.default_external = 'UTF-8';",
                    environment: 'production'
                }
            },
            compile: {
                options: {
                    sassDir: 'sass/source',
                    cssDir: 'css',
                    outputStyle:'expanded',
                    appDir: '.',
                    raw: "Encoding.default_external = 'UTF-8';",
                    environment: 'production'
                }
            },
            clean: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    appDir: '.',
                    raw: "Encoding.default_external = 'UTF-8';",
                    clean: true,
                    environment: 'production'
                }
            }
        },

        // available tasks
        tasks_list: {
            options: {},
            project: {
                options: {
                    tasks: [
                        {
                            name: 'build',
                            info: 'Create a build of (tested) the source files'
                        },
                        {
                            name: 'webserver',
                            info: 'Build the project, watch filechanges and start a webserver'
                        },
                        {
                            name: 'test',
                            info: 'Runt tests'
                        },
                        {
                            name: 'test:continuous',
                            info: 'Runt tests continuously'
                        }
                    ]
                }
            }
        }
    });

    // default
    grunt.registerTask('default', ['tasks_list:project']);
    grunt.registerTask('build', ['jshint:source', 'clean:build', 'compass:compile_min', 'compass:compile', 'closure-compiler:build', 'copy']);
    grunt.registerTask('webserver', ['build', 'open', 'connect:demo', 'watch']);
};