echo ****************************************************
echo Creating the todo database and todo accounts
echo ****************************************************
echo Please enter the root password for MySQL...
"%programfiles(x86)%\MySQL\MySQL Server 5.6\bin\mysql.exe" -u root -p -e "CREATE DATABASE IF NOT EXISTS todo; grant all on todo.* to 'todo'@'localhost' identified by 'todo';";
