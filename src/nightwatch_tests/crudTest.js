module.exports = {
  tags: ['Columbus'],
  'Test CRUD Operations' : function (client) {
      var nodes_created = 0;
    client
      .url('http://localhost:8888')
      .waitForElementVisible('body', 1000)
      // first create a node - calls createNode function
      .moveToElement('#graphContainer svg', 400, 400, createNode);


      // called to create a node
      function createNode () {
          client.doubleClick(function() {
              client
              .waitForElementPresent('.sideMenuHeader', 1000)
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
              .waitForElementVisible('.successToast', 1000)
              .assert.containsText('.successToast', 'Node Created')
              .waitForElementNotVisible('.successToast', 3000)
              .click('.node', editNode);
          } else {
              client
              .waitForElementVisible('.successToast', 1000)
              .assert.containsText('.successToast', 'Node Created')
              .waitForElementNotVisible('.successToast', 3000)
              // create another node
              .moveToElement('#graphContainer svg', 400, 400, createNode);
          }

      }

      // start editing after 2 nodes have been created
      function editNode() {
          client
          .waitForElementPresent('.sideMenuHeader', 1000)
          .assert.containsText('#sideMenu', 'Node Properties')
          .setValue('input', 'test')
          .click('.saveBtn', editSaveBtnClick);
      }

      // save the edit
      function editSaveBtnClick() {
          client
          .waitForElementVisible('.successToast', 1000)
          .assert.containsText('.successToast', 'Properties Updated')
          .waitForElementNotVisible('.successToast', 3000)
          .moveToElement('.node circle', 400, 400, createRelationship);
      }

      function createRelationship () {
          var endNodeId;
          client.getText('.node + .node text', function (result){
              endNodeId = result.value;
              client
              .doubleClick(function () {
                  client
                  .waitForElementPresent('.sideMenuHeader', 1000)
                  .assert.containsText('#sideMenu', 'Create Relationship')
                  .setValue('.labelInput', "EDGE")
                  .setValue('.endNodeInput', endNodeId)
                  .click('.saveBtn', relSaveBtnClick);
              });
          });
      }

      function relSaveBtnClick() {
          client
          .waitForElementPresent('.successToast', 1000)
          .assert.containsText('.successToast', 'Relationship Created')
          .waitForElementNotVisible('.successToast', 3000)
          .click('.link :last-of-type', editRel);
      }

      function editRel() {
          client
          .waitForElementPresent('#sideMenu', 1000)
          .assert.containsText('#sideMenu', 'Relationship Properties')
          .click('.saveBtn', relUpdateSaveBtnClicked);

      }

      function relUpdateSaveBtnClicked () {
          client
          .waitForElementPresent('.successToast',1000)
          .assert.containsText('.successToast', 'Properties Updated')
          .waitForElementNotVisible('.successToast', 3000)
          .click('.link :last-of-type', deleteRel);
      }

      function deleteRel() {
          client
          .waitForElementPresent('#sideMenu', 1000)
          .assert.containsText('#sideMenu', 'Relationship Properties')
          .waitForElementNotVisible('.successToast', 3000)
          .sendKeys('.link :last-of-type', [client.Keys.BACK_SPACE], function () {
              client
              .keys([client.Keys.NULL], function () {
                  client
                  .click('.node :last-of-type', deleteNodes);
              });
          });
      }
      var nodes_deleted = 0;
      function deleteNodes() {
          nodes_deleted++;
          if (nodes_deleted === 2){
              client.end();
          } else {
              client
              .waitForElementPresent('#sideMenu', 1000)
              .assert.containsText('#sideMenu', 'Node Properties')
              .keys([client.Keys.DELETE], function () {
                  client
                  .keys([client.Keys.NULL], function () {
                      client
                      .click('.node :last-of-type', deleteNodes);
                  });
              });
          }

      }

      // use :last-of-type selector to delete new relationship


  },

  after : function(client) {
    client.end();
  }
};
