To run locally:

1. Download and install node. (http://nodejs.org/#download)
2. Open an command prompt or terminal window and cd into the Columbus/src directory
3. Enter the command 'sudo npm start' to start the server
4. Enter your admin credentials
4. Make sure you have an instance of Neo4j running at localhost:7474
5. Open a web browser and enter http://localhost as the url

If your Neo4j database has data, it should be displayed in a directed graph.

Graph manipulation (Neo4j interface not yet implemented)
- use mouse wheel to zoom in and out
- shift-click in empty space to add a new node
- shift-click on a node to edit its title
- shift-click on a node and drag to another node to create a relationship
- click and drag nodes to move them around

<b>Testing and Metrics</b>

Black Box Test Plan<br>
-The Black Box Test Plan xml document can be found at src/public/reports/bbtp/BlackBoxTestPlan.xml <br>
-The BBTP can be viewed when the server is running in a browser at http://localhost:8888/bbtp/BlackBoxTestPlan.xml<br>

Mocha<br>
1. In a terminal, cd to the Columbus/src directory<br>
2. Enter the command "make ci"<br>
3. Unit test pass/fails will be displayed via command line<br>

Nightwatch<br>
1. In a terminal type 'sudo npm install -g nightwatch'<br>
2. cd to into the project's src directory<br>
3. Enter 'nightwatch' to run automated black box tests<br>
4. Nightwatch tests are located in the nightwatch_tests folder<br>
5. Nightwatch reports are located in the nightwatch_reports folder<br>


Istanbul<br>
1. MAKE SURE the server is not already running (otherwise coverage will be incorrect)<br>
2. In a terminal, cd to the Columbus/src directory<br>
3. Enter the command "make ci" followed by "npm start"<br>
4. Coverage reports can be viewed with a browser at http://localhost:8888/reports/lcov-report/index.html<br>

SonarQube<br>
1. Download SonarQube (http://www.sonarqube.org/downloads/) <br>
2. Download SonarQube Javascript Plug-in (http://docs.sonarqube.org/display/SONAR/JavaScript+Plugin)<br>
3. Place the SonarQube Javascript Plug-in jar in the SonarQube install directory at ./extensions/plugins<br>
4. From the SonarQube install directory execute the following script to start the server:<br>
-On Linux/Mac OS: ./bin/<YOUR OS>/sonar.sh start<br>
-On Windows: bin/windows-x86-XX/StartSonar.bat<br>
5. In a terminal, cd to the Columbus/src directory<br>
6. Enter the command "make ci"<br>
7. Access SonarQube reports with a browser at http://localhost:9000<br>
-SonarQube should now be setup to analyze only the project's source files.
