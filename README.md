# Инструкция по использованию веб-панели

## Установка

1. Проверьте установлен ли у вас `nodejs`

```bash
node -v
```

В случае если `nodejs` не установлен, установите

2. Проверьте, установлен ли у вас `npm`

```bash
npm -v
```

В случае если `npm` не установлен, установите

```bash
sudo apt install npm
```

3. Склонируйте репозиторий

```bash
git clone -b dev https://github.com/SamKamirov/web-panel.git
```

2. Установите зависимости

```bash
cd web-panel
npm i
```

3. Соберите проект

```bash
npm run build
```

4. Поместите файлы из директории `build` в папку, настроенную для выдачи статического контента

Done!


## Настройка окружения

Для настройки окружения панели используется файл `config.js` в корне директории `src`.

Для указания пути к АСУ, используйте переменную `API_TARGET`

```javascript
export const API_TARGET = "";
```

Для указания индекса смещения, используйте переменную `POSTFIX`

```javascript
export const POSTFIX = 20;
```

Для указания названия файла данных, используйте переменную `DATA_FILE` 

```javascript
export const DATA_FILE = 'data/log or zar.json';
```

[Руководство конвертера](./docs/CONVERTER_GUIDE.md)
