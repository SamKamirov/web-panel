# Инструкция по использованию

## Установка

1. Проверьте установлен ли у вас `nodejs`

```bash
node -v
```

В случае если `nodejs` не установлен, установите

```bash
sudo apt update
sudo apt install nodejs
```

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

Done!

Вы готовы к использованию панели и конвертера.

[Руководство конвертера](./docs/CONVERT_GUIDE.md)

[Руководство синхронизатора](./docs/RSYNC_GUIDE.md)
