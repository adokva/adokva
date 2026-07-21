# PROJECT STRUCTURE

Последнее обновление: июль 2026

---

# Корень проекта

adokva2/

Главные папки проекта:

app/

components/

components/camera/

data/

lib/

public/

types/

ADOKVA_HISTORY/

---

# app/

Основные страницы приложения.

Главная страница:

page.tsx

Корневой layout:

layout.tsx

---

# components/

Главные визуальные компоненты.

CanvasScene

Globe

Atmosphere

Clouds

NightLights

AnimatedStars

SpaceBackground

SatelliteManager

Sun

Moon

Mars

SearchPanel

PersonCard

WelcomeScreen

MenuButton

---

# Управление камерой

CameraIntro

FlightCamera

FocusOrbitControls

WorldCameraController

---

# components/camera/

Новая модульная архитектура камеры.

CameraMath.ts

CameraState.ts

CameraAnimation.ts

CameraEasing.ts

CameraFlight.ts

В будущем:

CameraPhysics.ts

CameraConstraints.ts

CameraSpline.ts

CameraTarget.ts

CameraDebug.ts

---

# data/

Статические данные проекта.

Локации.

Люди.

Страны.

Города.

---

# public/

Текстуры.

Иконки.

Изображения.

3D-ресурсы.

---

# lib/

Общие функции проекта.

Математика.

Космос.

Вспомогательные функции.

---

# types/

Общие TypeScript-типы.

---

# Документация

ADOKVA_MASTER.md

Главный документ проекта.

DEVELOPMENT_LOG.md

История разработки.

MISSION.md

Миссия проекта.

VISION.md

Долгосрочное видение.

PROJECT_STRUCTURE.md

Описание структуры проекта.

ROADMAP.md

План развития.

DECISIONS.md

Архитектурные решения.

BUG_HISTORY.md

История исправленных ошибок.

IDEAS.md

Идеи для будущих версий.

CHANGELOG.md

История изменений.

---

# Основной принцип

Каждый новый файл должен иметь понятную задачу.

Каждая папка должна содержать только логически связанные файлы.

Рост проекта не должен ухудшать читаемость структуры.