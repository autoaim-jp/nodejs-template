use nodejs_template_db;


create table userList (
  userId int unsigned not null auto_increment primary key,
  userName varchar(32) not null unique
);

create table userCredential (
  userId int unsigned not null unique,
  sha256Pass varchar(32) not null,
  foreign key (userId) references userList(userId)
);

create table accessTokenList (
  userId int unsigned not null,
  accessToken varchar(128) not null unique,
  foreign key (userId) references userList(userId)
);

create table fileList (
  fileId int unsigned not null auto_increment primary key,
  userId int unsigned not null,
  fileLabel varchar(32) not null,
  fileName varchar(32) not null,
  fileContent varchar(128) not null,
  foreign key (userId) references userList(userId)
);


