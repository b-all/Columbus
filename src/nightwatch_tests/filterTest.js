module.exports = {
  tags: ['Columbus'],
  'Test Filter' : function (client) {
      var nodes_created = 0;
    client
      .url('http://localhost:8080')
      .waitForElementVisible('#graphContainer svg', 10000)
      // first create a node - calls createNode function
      .moveToElement('#graphContainer svg', 400, 400, createNode);


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
              //use obscure filter term so that multiple items aren't returned by filter
              .setValue('.pValueInput', "filter_term_test_5_3_1_7_4_3_6_29")
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
          .click('#filterBtn', clickFilterBtn);
      }

      function clickFilterBtn() {
          client
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', "Filter")
          .setValue('#filterInput', "filter_term_test_5_3_1_7_4_3_6_29")
          .click('.filterBtn', filterBtnClick);
      }

      function filterBtnClick () {
          client
          .waitForElementVisible('.resultsDesc', 15000)
          .assert.containsText('#sideMenu', 'Found 1 match...')
          .useXpath()
          .click('//*[local-name() = \'g\'][@class="node"][last()]', clickDeleteNode);
      }

      function clickDeleteNode () {
          client
          .useCss()
          .waitForElementVisible('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', 'Node Properties')
          .click('.deleteBtn', function (){
              client
              .click('#filterBtn', filterAgain);
          });
      }

      function filterAgain () {
          client
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', "Filter")
          .setValue('#filterInput', "filter_term_test_5_3_1_7_4_3_6_29")
          .click('.filterBtn', filterBtnClick2);
      }

      function filterBtnClick2 () {
          client
          .waitForElementVisible('.resultsDesc', 10000)
          .assert.containsText('.resultsDesc', 'Found 0 matches...');
      }

  },

  after : function(client) {
    client.end();
  }
};
