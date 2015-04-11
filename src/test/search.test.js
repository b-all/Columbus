var request = require('supertest');
var assert = require('assert');

var auth = {
	pw: 'bmVvNGo6cGlsbGFnZQ==',
	host: 'localhost',
	port: '7474',
	isHttps: false
};

var node_id;

describe('search.js', function () {
	before(function () {

	});

	describe('Search', function () {

		it('should create a node', function (done) {
            request('http://localhost:8080').post('/addNode').send({ label: 'Test', data: "{name: \"Test\"}", auth:JSON.stringify(auth) }).end( function (err, res) {
                node_id = JSON.parse(res.text).data[0][0];
                assert.equal(200, res.statusCode);
                done();
            });
        });

		it('should return 200 - get property keys', function (done) {
			var data = {
				auth: JSON.stringify(auth)
			};
			request('http://localhost:8080').post('/getPropertyKeys').send(data)
			.end(function (err,res) {
				assert.equal(200, res.statusCode);
                done();
			});
		});

        it('should return 200 - valid search', function (done) {
            var uri = '/search';
			var data = {
				target: 'test',
				auth: JSON.stringify(auth)
			};
            // search can take a while so set timeout to 10 seconds
            this.timeout(10000);
            request('http://localhost:8080').post(uri).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

		it('should return 200 - valid where search', function (done) {
			var uri = '/searchWhere';
			var where = {
				prop: 'name',
				val: 'test'
			}
			var data = {
				auth: JSON.stringify(auth),
				where: JSON.stringify(where)
			};
			request('http://localhost:8080').post(uri).send(data)
			.end(function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

        it('should return an error - null target', function (done) {
            var uri = '/search';
			var data = {
				target: null,
				auth: JSON.stringify(auth)
			};
            // search can take a while so set timeout to 10 seconds
            this.timeout(10000);
            request('http://localhost:8080').post(uri).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Error: Null Search Term", JSON.parse(res.text).err);
                done();
            });
        });

        it('should return no results msg - obscure target', function (done) {
            var uri = '/search';
			var data = {
				target: 'Tā+yǐjīng+chéngwéi+wánquán+shīqùle+duì+tā'+
	                        '+de+shēntǐ+qíngkuàng%2C+zhè+zhǒng+xīnlǐ+de+fēiyuè+guòchéng'+
	                        '+zhōng%2C+zhǐyǒu+huílái+gěi+tā+yīgè+cūlüè+de+huígù.+Jǐ+mǎ+'+
	                        'shàng%2C+tā+tíngdùnle+yīxià+yī+duì+mǎ+qǔdé+qí+wàiguān+xiǎoshān'+
	                        '+de+méitóu+xiàmiàn%2C+yǐjīng+dádàole+bàn+xiǎoshí+de+cóng+jùdà+de'+
	                        '+xià+pō+dǐbù+wān+yán+qiánjìn+lì+dì+dìfāng.&oq=Tā+yǐjīng+chéngwéi'+
	                        '+wánquán+shīqùle+duì+tā+de+shēntǐ+qíngkuàng%2C+zhè+zhǒng+xīnlǐ+de'+
	                        '+fēiyuè+guòchéng+zhōng%2C+zhǐyǒu+huílái+gěi+tā+yīgè+cūlüè+de+huígù.'+
	                        '+Jǐ+mǎ+shàng%2C+tā+tíngdùnle+yīxià+yī+duì+mǎ+qǔdé+qí+wàiguān+xiǎoshān'+
	                        '+de+méitóu+xiàmiàn%2C+yǐjīng+dádàole+bàn+xiǎoshí+de+cóng+jùdà+de+xià'+
	                        '+pō+dǐbù+wān+yán+qiánjìn+lì+dì+dìfāng.',
				auth: JSON.stringify(auth)
			};
            // search can take a while so set timeout to 14 seconds (this one might take longer)
            this.timeout(14000);
            request('http://localhost:8080').post(uri).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("No matching results.", JSON.parse(res.text).err);
                done();
            });
        });

		it('should delete a node', function (done) {
            request('http://localhost:8080').post('/deleteNode').send({ node:JSON.stringify({id: node_id}), auth: JSON.stringify(auth) }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

	});

	after(function() {

	});
});
