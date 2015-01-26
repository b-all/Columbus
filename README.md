To run locally: 

1. Download and install node. (http://nodejs.org/#download)
2. Open an command prompt or terminal window and cd into the Columbus directory
3. Enter the command 'npm start' to start the server
4. Make sure you have an instance of Neo4j running at localhost:7474
5. Open a web browser and enter localhost:8888 as the url

If your Neo4j database has data, it should be displayed in a directed graph. 

Graph manipulation (Neo4j interface not yet implemented)
- use mouse wheel to zoom in and out
- shift-click in empty space to add a new node 
- shift-click on a node to edit its title
- shift-click on a node and drag to another node to create a relationship
- click and drag nodes to move them around

<b>Testing and Metrics</b>

SonarQube<br>
<ol><li>Download SonarQube (http://www.sonarqube.org/downloads/)</li>
<li>Download SonarQube Javascript Plug-in (http://docs.sonarqube.org/display/SONAR/JavaScript+Plugin)</li>
<li>Place the SonarQube Javascript Plug-in jar in the SonarQube install directory at ./extensions/plugins</li>
<li>From the SonarQube install directory execute the following script to start the server:</li>
<ul><li>On Linux/Mac OS: ./bin/<YOUR OS>/sonar.sh start</li>
<li>-On Windows: bin/windows-x86-XX/StartSonar.bat</li></ul>
<li>In a terminal, cd to the Columbus directory</li>
<li>Enter the command "make ci"</li>
<li>Access SonarQube reports with a browser at localhost:9000</li></ol>

Istanbul<br>
<ol><li>In a terminal, cd to the Columbus directory</li>
<li>Enter the command "make ci"</li>
<li>Coverage reports can be viewed with a browser at http://localhost:8888/reports/lcov-report/index.html</li></ol>

Mocha<br>
<ol><li>In a terminal, cd to the Columbus directory</li>
<li>Enter the command "make ci"</li>
<li>Unit test pass/fails will be displayed via command line</li></ol>