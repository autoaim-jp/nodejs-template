use nodejs_template_db;

insert ignore into userList (userId, userName) values (1, 'test user');
insert ignore into userCredential (userId, sha256Pass) values (1, 'sha256pass');
insert ignore into accessTokenList (userId, accessToken) values (1, 'accessTokenProductionDebug')
insert ignore into fileList (fileId, userId, fileLabel, fileName, fileContent) values (1, 1, 'fileLabelProducitonDebug', 'test file', 'debug file content hello world');

