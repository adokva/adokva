# BUG HISTORY

## История исправленных ошибок

---

# Ошибка №1

## Отсутствовал layout.tsx

### Симптом

Проект не запускался, Next.js сообщал об отсутствии корневого layout.

### Решение

Создан файл `app/layout.tsx` с обязательными тегами `<html>` и `<body>`.

---

# Ошибка №2

## Конфликт структуры проекта

### Симптом

После многочисленных изменений проект стал нестабильным.

### Решение

Создан новый проект `adokva2` с чистой архитектурой.

---

# Ошибка №3

## Конфликт порта

### Симптом

Сервер разработки не запускался на порту 3000.

### Решение

Использован свободный порт, после чего приложение успешно стартовало.

---

# Ошибка №4

## Проблемы с камерой

### Симптом

После некоторых полётов появлялся крен горизонта.

### Статус

Выполнена большая часть рефакторинга. Продолжается тонкая настройка Camera Engine.

---

# Ошибка №5

## Ложные ошибки в VS Code

### Симптом

В списке Problems появились ошибки, не относящиеся к проекту.

### Причина

В папку проекта был случайно сохранён HTML-файл с текстом переписки, который VS Code пытался анализировать как исходный код.

### Решение

Файл был удалён. После этого количество ошибок вернулось к:

Problems = 0.

---

# Главный вывод

После каждого изменения необходимо проверять:

- успешную компиляцию проекта;
- список Problems;
- работу приложения в браузере.

Это позволяет обнаруживать проблемы сразу после их появления.
---

# BUG: Planet camera instability

Date:
2026-07-25


## Description

When selecting planets in Solar View:

Expected:

Camera smoothly approaches selected object and stays focused.


Actual:

Some objects:
- approach correctly;
- then suddenly switch toward Earth;
- lose smooth tracking.


Mercury:

Works better than other planets.


Mars:

Currently feels the smoothest.


## Suspected Cause

Multiple camera systems may compete:

- WorldCameraController
- PlanetOrbitControls
- SolarOrbitControls
- FlightCamera
- FocusOrbitControls


## Status

OPEN

Waiting for camera system analysis.

---