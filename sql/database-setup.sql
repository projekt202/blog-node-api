CREATE USER todo IDENTIFIED by 'todo';
CREATE DATABASE IF NOT EXISTS todo; 
GRANT ALL PRIVILEGES ON todo.* to 'todo'@'localhost' WITH GRANT OPTION;