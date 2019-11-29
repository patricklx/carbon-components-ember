name: Update Latest Docs And Release

on: release

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]

    steps:
    - uses: actions/checkout@v1
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: npm install, build, and test
      run: |
        npm install -g ember-cli
        npm install
        ember deploy production        
      env:
        CI: true
        ADDON_DOCS_VERSION_PATH: "${GITHUB_REF##*/}"
        ADDON_DOCS_UPDATE_LATEST: true
    - name: npm publish
      run: |
        npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
        npm publish