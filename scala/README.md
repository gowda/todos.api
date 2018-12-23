# todos

Implementation of TODO list HTTP API in scala, using twitter's
[finatra](https://twitter.github.io/finatra/).

### Tests
#### External dependencies
[`MySQL`](https://www.mysql.com/) server is required for running tests.

Tests expect to find `todos` database with username `todoer` and
password `todoer`.

**NOTE:** MySQL 8.0.4+ password should be configured to be identified with
'mysql_native_password', failure would lead to
`java.sql.SQLException: Unable to load authentication plugin 'caching_sha2_password'`
```mysql
mysql> create user 'todoer'@'localhost' identified with mysql_native_password 'todoer';
mysql> create database todos;
mysql> grant all privileges on todos.* to 'todoer'@'localhost';
```

#### Run
```bash
$ sbt test
```
