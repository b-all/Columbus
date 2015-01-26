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
- shift-click on a node to edit it's title
- shift-click on a node and drag to another node to create a relationship
- click and drag nodes to move them around

<b>Testing and Metrics</b>

SonarQube
1. Download SonarQube (http://www.sonarqube.org/downloads/)
2. Download SonarQube Javascript Plug-in (http://docs.sonarqube.org/display/SONAR/JavaScript+Plugin)
3. Place the SonarQube Javascript Plug-in jar in the SonarQube install directory at ./extensions/plugins
4. From the SonarQube install directory execute the following script to start the server:
	-On Linux/Mac OS: ./bin/<YOUR OS>/sonar.sh start
	-On Windows: bin/windows-x86-XX/StartSonar.bat
5. In a terminal, cd to the Columbus directory
6. Enter the command "make ci"
7. Access SonarQube reports with a browser at localhost:9000

Istanbul
1. In a terminal, cd to the Columbus directory
2. Enter the command "make ci"
3. Coverage reports can be viewed with a browser at http://localhost:8888/reports/lcov-report/index.html

Mocha
1. In a terminal, cd to the Columbus directory
2. Enter the command "make ci"
3. Unit test pass/fails will be displayed via command line