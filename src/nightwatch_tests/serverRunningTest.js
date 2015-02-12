module.exports = {
  tags: ['Columbus'],
  'Test that Columbus server is running' : function (client) {
    client
      .url('http://localhost:8888')
      .waitForElementVisible('body', 1000)
      .assert.title('Columbus - Neo4j Editor and Visualization Tool')
      .click('.navArrowContainer', function() {
          client.assert.containsText('#sideMenu', 'Welcome to Columbus');
      });



  },

  after : function(client) {
    client.end();
  }
};
