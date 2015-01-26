# use the tools as dev dependencies rather than installing them globaly
# it lets you handle specific versions of the tooling for each of your projects
MOCHA=node_modules/.bin/mocha
_MOCHA=node_modules/.bin/_mocha
ISTANBUL=node_modules/.bin/istanbul
JSHINT=node_modules/.bin/jshint

# test files must end with ".test.js"
TESTS=$(shell find test/ -name "*.test.js")

clean:
	rm -rf ./src/public/reports

test:
	$(MOCHA) -R spec $(TESTS)

xunit:
	@# check if reports folder exists, if not create it
	@test -d ./src/public/reports || mkdir ./src/public/reports
	XUNIT_FILE="reports/TESTS-xunit.xml" $(MOCHA) -R xunit-file $(TESTS)

coverage:
	@# check if reports folder exists, if not create it
	@test -d ./src/public/reports || mkdir ./src/public/reports
	$(ISTANBUL) cover --hook-run-in-context --dir ./src/public/reports $(_MOCHA) -- -R spec $(TESTS)

sonar:
	@# add the sonar sonar-runner executable to the PATH
	PATH="$$PWD/tools/sonar-runner-2.4/bin:$$PATH" sonar-runner

ci: clean xunit coverage sonar

