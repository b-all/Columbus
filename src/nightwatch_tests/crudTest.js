module.exports = {
  tags: ['Columbus'],
  'Test CRUD Operations' : function (client) {
      var nodes_created = 0;
    client
      .url('http://localhost:8080');
      // first create a node - calls createNode function
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
      client
      .waitForElementVisible('#graphContainer svg', 10000)
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
              .click('.saveBtn', saveBtnClick);
          });
      }

      //called from createNode to save a node
      function saveBtnClick() {
          nodes_created++;
          if (nodes_created === 2) {
              client
              .waitForElementVisible('.successToast', 10000)
              .assert.containsText('.successToast', 'Node Created')
              .waitForElementNotVisible('.successToast', 3000)
              .useXpath()
              .click('//*[local-name() = \'g\'][@class="node"][last() - 1]', editNode);
          } else {
              client
              .waitForElementVisible('.successToast', 10000)
              .assert.containsText('.successToast', 'Node Created')
              .waitForElementNotVisible('.successToast', 3000)
              // create another node
              .moveToElement('#graphContainer svg', 400, 400, createNode);
          }

      }

      // start editing after 2 nodes have been created
      function editNode() {
          client
          .useCss()
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', 'Node Properties')
          .click('.addPropBtn', function () {
              client
              .setValue('input', 'test')
              .click('.saveBtn', editSaveBtnClick);
          });
      }

      // save the edit
      function editSaveBtnClick() {
          client
          .waitForElementVisible('.successToast', 10000)
          .assert.containsText('.successToast', 'Properties Updated')
          .waitForElementNotVisible('.successToast', 3000)
          .useXpath()
          .getText('//*[local-name() = \'g\'][@class="node"][last() - 1]', createRelationship);
      }

      function createRelationship (endNodeId) {
          endNodeId = endNodeId.value;
              client
              .getText('//*[local-name() = \'g\'][@class="node"][last()]', function (startNodeId) {
                  client
                  .useCss()
                  .click('#createRelBtn',function () {
                      client
                      .waitForElementPresent('.selectEndNodeBtn', 10000)
                      .assert.containsText('#sideMenu', 'Create Relationship')
                      .setValue('.labelInput', "EDGE")
                      .setValue('.startNodeInput', startNodeId.value)
                      .setValue('.endNodeInput', endNodeId)
                      .click('.saveBtn', relSaveBtnClick);
              });
          });
      }

      function relSaveBtnClick() {
          client
          .waitForElementPresent('.successToast', 10000)
          .assert.containsText('.successToast', 'Relationship Created')
          .waitForElementNotVisible('.successToast', 3000);
          client
          .useXpath()
          .click('//*[local-name() = \'g\'][@class="link"][last()]', editRel);
      }

      function editRel() {
          client
          .useCss()
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', 'Relationship Properties')
          .click('.saveBtn', relUpdateSaveBtnClicked);

      }

      function relUpdateSaveBtnClicked () {
          client
          .waitForElementPresent('.successToast',10000)
          .assert.containsText('.successToast', 'Properties Updated')
          .waitForElementNotVisible('.successToast', 3000);
          client
          .useXpath()
          .click('//*[local-name() = \'g\'][@class="link"][last()]', deleteRel);
      }

      function deleteRel() {
          client
          .useCss()
          .waitForElementPresent('.sideMenuHeader', 10000)
          .assert.containsText('#sideMenu', 'Relationship Properties')
          .waitForElementNotVisible('.successToast', 3000)
          .click('.deleteBtn', function () {
              client
              .useXpath()
              .click('//*[local-name() = \'g\'][@class="node"][last()]', deleteNodes);
          });
      }
      var nodes_deleted = 0;
      function deleteNodes() {
          nodes_deleted++;
          if (nodes_deleted === 2){
              client
              .useCss()
              .click('.deleteBtn', function () {
                  client
                  .end();
              });
          } else {
              client
              .useCss()
              .waitForElementVisible('#sideMenu', 10000)
              .assert.containsText('#sideMenu', 'Node Properties')
              .click('.deleteBtn', function () {
                  client
                  .useXpath()
                  .click('//*[local-name() = \'g\'][@class="node"][last()]', deleteNodes);
              });
          }

      }

      // use :last-of-type selector to delete new relationship


  },

  after : function(client) {
    client.end();
  }
};
