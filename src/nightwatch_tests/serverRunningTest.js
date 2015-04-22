module.exports = {
  tags: ['Columbus'],
  'Test that Columbus server is running' : function (client) {
    client
      .url('http://localhost:8080');

      if (client.getText('.modal-header', function (result) {
          if (result.value.indexOf('Settings') !== -1) {
              return true;
          } else {
              return false;
          }
      })) {
          client.waitForElementVisible('#hostInput', 10000)
                .click('#httpRadio')
                .setValue('#hostInput', 'localhost')
                .setValue('#portInput', '7474')
                .setValue('#userNameInput', 'neo4j')
                .setValue('#passwordInput', 'pillage')
                .click('#neo4jModalSaveBtn');
      }
      client.waitForElementVisible('body', 1000)
          .assert.title('Columbus - Neo4j Editor and Visualization Tool')
          .click('.navArrowContainer', function() {
              client.assert.containsText('#sideMenu', 'Welcome to Columbus');
          });



  },

  after : function(client) {
    client.end();
  }
};
