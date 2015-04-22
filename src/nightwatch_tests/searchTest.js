module.exports = {
  tags: ['Columbus'],
  'Test Search' : function (client) {
      var nodes_created = 0;
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
      // first create a node - calls createNode function
      client.moveToElement('#graphContainer svg', 400, 400, createNode)
            .waitForElementVisible('#graphContainer svg', 10000);


      // called to create a node
      function createNode () {
          client.doubleClick(function() {
              client
              .waitForElementPresent('.sideMenuHeader', 10000)
              //zoom out so most nodes are visible in window
              .execute(function () {
                  var d = document.getElementById("graph");
                  d.setAttribute("transform", "translate("+ 540 + "," + 196 +
                  ") scale(" + 0.16 + ")");

              })
              .assert.containsText('#sideMenu', 'Create Node')
              .setValue('.labelInput', "Test")
              .setValue('.pNameInput', "prop")
              //use obscure search term so that multiple items aren't returned by search
              .setValue('.pValueInput', "search_term_test_5_3_1_7_4_3_6_29")
              .click('.saveBtn', saveBtnClick);
          });
      }

      //called from createNode to save a node
      function saveBtnClick() {
          client
          .waitForElementVisible('.successToast', 10000)
          .assert.containsText('.successToast', 'Node Created')
          .waitForElementNotVisible('.successToast', 3000)
          .useCss()
          .click('#searchBtn', clickSearchBtn);
      }

      function clickSearchBtn() {
          client
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', "Search")
          .setValue('#searchInput', "search_term_test_5_3_1_7_4_3_6_29")
          .click('.searchBtn', searchBtnClick);
      }

      function searchBtnClick () {
          client
          .waitForElementVisible('.resultsDesc', 15000)
          .assert.containsText('#sideMenu', 'Found')
          .click('.node', clickDeleteNode);
      }

      function clickDeleteNode () {
          client
          .waitForElementVisible('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', 'Node Properties')
          .click('.deleteBtn', function (){
              client
              .click('#yesBtn')
              .click('#searchBtn', searchAgain);
          });
      }

      function searchAgain () {
          client
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', "Search")
          .setValue('#searchInput', "search_term_test_5_3_1_7_4_3_6_29")
          .click('.searchBtn', searchBtnClick2);
      }

      function searchBtnClick2 () {
          client
          .waitForElementVisible('.failToast', 10000)
          .assert.containsText('.failToast', 'No matching results')
          .waitForElementNotVisible('.failToast', 3000);
      }

  },

  after : function(client) {
    client.end();
  }
};
