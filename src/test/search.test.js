var request = require('supertest');
var assert = require('assert');

describe('search.js', function () {
	before(function () {

	});

	describe('Search', function () {

        it('should return 200 - valid search', function (done) {
            var uri = '/search?target=the%20matrix';
            // search can take a while so set timeout to 10 seconds
            this.timeout(10000);
            request('http://localhost:8080').get(uri)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - null target', function (done) {
            var uri = '/search';
            // search can take a while so set timeout to 10 seconds
            this.timeout(10000);
            request('http://localhost:8080').get(uri)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should return no results msg - obscure target', function (done) {
            var uri = '/search?target=Tā+yǐjīng+chéngwéi+wánquán+shīqùle+duì+tā'+
                        '+de+shēntǐ+qíngkuàng%2C+zhè+zhǒng+xīnlǐ+de+fēiyuè+guòchéng'+
                        '+zhōng%2C+zhǐyǒu+huílái+gěi+tā+yīgè+cūlüè+de+huígù.+Jǐ+mǎ+'+
                        'shàng%2C+tā+tíngdùnle+yīxià+yī+duì+mǎ+qǔdé+qí+wàiguān+xiǎoshān'+
                        '+de+méitóu+xiàmiàn%2C+yǐjīng+dádàole+bàn+xiǎoshí+de+cóng+jùdà+de'+
                        '+xià+pō+dǐbù+wān+yán+qiánjìn+lì+dì+dìfāng.&oq=Tā+yǐjīng+chéngwéi'+
                        '+wánquán+shīqùle+duì+tā+de+shēntǐ+qíngkuàng%2C+zhè+zhǒng+xīnlǐ+de'+
                        '+fēiyuè+guòchéng+zhōng%2C+zhǐyǒu+huílái+gěi+tā+yīgè+cūlüè+de+huígù.'+
                        '+Jǐ+mǎ+shàng%2C+tā+tíngdùnle+yīxià+yī+duì+mǎ+qǔdé+qí+wàiguān+xiǎoshān'+
                        '+de+méitóu+xiàmiàn%2C+yǐjīng+dádàole+bàn+xiǎoshí+de+cóng+jùdà+de+xià'+
                        '+pō+dǐbù+wān+yán+qiánjìn+lì+dì+dìfāng.';
            // search can take a while so set timeout to 14 seconds (this one might take longer)
            this.timeout(14000);
            request('http://localhost:8080').get(uri)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("No matching results.", JSON.parse(res.text).err);
                done();
            });
        });

	});

	after(function() {

	});
});
