# Developer style guide and conventions

Generally, this style guide is followed: https://github.com/johnpapa/angular-styleguide

# Pre-Requisites

Before going through the installation procedure below, please first set up the App Server. That procedure will take you through installing some required Ubuntu packages and setting up Node.js.

# Installation

This guide describes setup for local/dev installs only, not production deployment.

1. Under app/scripts/core/config/parameters, copy the file `local.sample.js` to `local.js`, and modify the settings to match your setup.

2. Install dependencies

    ```
    npm install
    ```

3. Install bower globally

    ```
    sudo npm install -g bower
    ```

4. Run bower installation

    ```
    bower install
    ```

5. Install grunt globally.

    ```
    sudo npm install -g grunt grunt-cli
    ```

6. Serve application on port 9000. See the 'Troubleshooting' section below if you are having trouble serving with grunt.

    ```
    grunt serve
    ```

# Static generator

1. Run static generator on port 3000

    ```
    grunt static
    ```

# Troubleshooting

## Dropbox users

If you are using a program like Dropbox on Linux, you may have trouble with Grunt due to running out of system file watches. To increase the number of watches, issue the following command:

`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`