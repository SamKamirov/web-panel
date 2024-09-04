# Инструкция по использованию

Данный скрипт предназначен для конвертирования файлов .xlsx подготовленного формата в JSON

## Использование

Перейдите в директорию

`cd xlsx-to-json-converter`

Проверьте установлен ли у вас NodeJS

`node -v`

Установите зависимости

`npm install`

### Один файл

Для конвертации одного конкретного файла, запустите скрипт, передав аргументом путь до файла .xlsx

`node index.js ~/path/to/file.xslx`

### Все файлы

Для конвертации всех файлов, переместите их в папку `xlsx-to-json-converter`, после чего запустите скрипт

`node index.js`

Необходимые файлы появятся в папке **web-panel**

Перейдите в папку **web-panel**

### Запуск

Установите пакет http-server

`npm install http-server`

Перейдите в папку **panel** и выполните комманду

`http-server .`
