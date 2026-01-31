// Класс для работы с CMS данными в Framer
class FramerCMS {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
        this.useMockData = false; // Флаг для использования тестовых данных
    }

    // Получить тестовые данные боксов
    getMockBoxes() {
        return [
            {
                id: 1,
                name: "Классический бокс",
                short_description: "Идеальный выбор для семейного ужина",
                price: 2500,
                badge1: "Хит продаж",
                badge2: "Новинка",
                detailed_description: "Прекрасный набор блюд для семейного ужина на 4 персоны",
                whats_inside: "Салат Цезарь, Паста Карбонара, Тирамису, Вино",
                goes_with: "Отлично сочетается с нашими десертами",
                photo1: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
                photo2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                photo3: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400"
            },
            {
                id: 2,
                name: "Премиум бокс",
                short_description: "Изысканные блюда для особого случая",
                price: 4500,
                badge1: "Премиум",
                badge2: "",
                detailed_description: "Элитный набор блюд от шеф-повара для торжественного мероприятия",
                whats_inside: "Устрицы, Стейк Веллингтон, Трюфельный десерт, Шампанское",
                goes_with: "Рекомендуем дополнить цветочным оформлением",
                photo1: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
                photo2: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
                photo3: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
            },
            {
                id: 3,
                name: "Здоровый выбор",
                short_description: "Полезные и вкусные блюда",
                price: 1800,
                badge1: "Эко",
                badge2: "Низкокалорийный",
                detailed_description: "Сбалансированное меню для тех, кто следит за здоровьем",
                whats_inside: "Киноа салат, Запеченная рыба, Фруктовый смузи",
                goes_with: "Идеально для спортивных мероприятий",
                photo1: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
                photo2: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400",
                photo3: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"
            }
        ];
    }

    // Генерация slug из названия бокса
    generateSlug(name) {
        // Таблица транслитерации
        const translitMap = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
            'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
            'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
            'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
            'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
            'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
        };
        
        let slug = name.toLowerCase();
        
        // Транслитерация
        for (let char in translitMap) {
            slug = slug.replace(new RegExp(char, 'g'), translitMap[char]);
        }
        
        // Очистка и форматирование
        slug = slug
            .replace(/[^a-z0-9\s-]/g, '') // Убираем все кроме букв, цифр, пробелов и дефисов
            .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
            .replace(/-+/g, '-') // Убираем повторяющиеся дефисы
            .replace(/^-|-$/g, ''); // Убираем дефисы в начале и конце
        
        return slug;
    }

    // Получить все боксы
    async getBoxes() {

        
        // Если включены моковые данные, возвращаем их
        if (this.useMockData) {
    
            const mockData = this.getMockBoxes();
    
            return mockData;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}admin/boxes.json`);
    
            if (!response.ok) throw new Error(`Failed to fetch boxes: ${response.status} ${response.statusText}`);
            const data = await response.json();
            
    
            
            // Проверяем, что получили объект с данными
            if (data && data.error) {
                console.error('❌ API Error:', data.error);
        
                this.useMockData = true;
                return this.getMockBoxes();
            }
            
            // Преобразуем объект в массив
            if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                const boxesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
        
        
                return boxesArray;
            }
            
            if (!Array.isArray(data)) {
                console.error('❌ Expected object or array but got:', typeof data, data);
        
                this.useMockData = true;
                return this.getMockBoxes();
            }
            
    
    
            return data;
        } catch (error) {
            console.error('❌ Error fetching boxes:', error);
    
            this.useMockData = true;
            return this.getMockBoxes();
        }
    }

    // Получить конкретный бокс по ID
    async getBox(id) {
        try {
            const response = await fetch(`${this.baseUrl}api/boxes.php?id=${id}`);
            if (!response.ok) throw new Error('Failed to fetch box');
            return await response.json();
        } catch (error) {
            console.error('Error fetching box:', error);
            return null;
        }
    }

    // Получить все мероприятия
    async getEvents() {
        try {
            const response = await fetch(`${this.baseUrl}api/events.php`);
            if (!response.ok) throw new Error('Failed to fetch events');
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    // Получить конкретное мероприятие по ID
    async getEvent(id) {
        try {
            const response = await fetch(`${this.baseUrl}api/events.php?id=${id}`);
            if (!response.ok) throw new Error('Failed to fetch event');
            return await response.json();
        } catch (error) {
            console.error('Error fetching event:', error);
            return null;
        }
    }

    // Заполнить элементы боксов на странице
    async populateBoxes(containerName, templateName) {

        
        const container = document.querySelector(`[data-framer-name="${containerName}"]`);
        const template = document.querySelector(`[data-framer-name="${templateName}"]`);
        


        
        if (!container || !template) {
            console.error('❌ Container or template not found:', containerName, templateName);
            return;
        }

        // Проверяем, что template действительно скрыт и готов к клонированию
        if (template.style.display !== 'none') {
    
            template.style.display = 'none';
        }

        const boxes = await this.getBoxes();

        
        // Проверяем, что boxes - это массив
        if (!Array.isArray(boxes)) {
            console.error('❌ Boxes is not an array:', typeof boxes, boxes);
            return;
        }
        
        if (boxes.length === 0) {
    
            return;
        }


        // Очищаем контейнер, кроме шаблона
        const children = Array.from(container.children);

        children.forEach(child => {
            if (child !== template && !child.hasAttribute('data-framer-name')) {
                child.remove();
            }
        });


        // Создаем элементы для каждого бокса
        boxes.forEach((box, index) => {
    
            
            const boxElement = template.cloneNode(true);
            
            // Функция для применения ручных стилей для страницы catering-box
            const applyManualStyles = (boxElement) => {
                // Определяем, на какой странице мы находимся
                const isCateringBoxPage = window.location.pathname.includes('catering-box');
                
                if (!isCateringBoxPage) {
            
                    return;
                }
                
        
                
                // Стили для названия
                const nameElement = boxElement.querySelector('[data-framer-name="box-name"]');
                if (nameElement) {
                    nameElement.style.color = '#FFF';
                    nameElement.style.fontFamily = 'Inter';
                    nameElement.style.fontSize = '22px';
                    nameElement.style.fontStyle = 'normal';
                    nameElement.style.fontWeight = '600';
                    nameElement.style.lineHeight = '115%';
                    nameElement.style.letterSpacing = '-0.44px';
            
                }
                
                // Стили для краткого описания
                const shortDescElement = boxElement.querySelector('[data-framer-name="box-short-description"]');
                if (shortDescElement) {
                    shortDescElement.style.color = '#FFF';
                    shortDescElement.style.fontFamily = 'Inter';
                    shortDescElement.style.fontSize = '16px';
                    shortDescElement.style.fontStyle = 'normal';
                    shortDescElement.style.fontWeight = '500';
                    shortDescElement.style.lineHeight = '140%';
                    shortDescElement.style.letterSpacing = '-0.32px';
                    shortDescElement.style.opacity = '0.4';
            
                }
                
                // Стили для цены
                const priceElement = boxElement.querySelector('[data-framer-name="box-price"]');
                if (priceElement) {
                    priceElement.style.color = '#FFF';
                    priceElement.style.fontFamily = 'Inter';
                    priceElement.style.fontSize = '22px';
                    priceElement.style.fontStyle = 'normal';
                    priceElement.style.fontWeight = '600';
                    priceElement.style.lineHeight = '115%';
                    priceElement.style.letterSpacing = '-0.44px';
            
                }
            };
            
            // Применяем ручные стили для текстовых элементов
            applyManualStyles(boxElement);
            
            boxElement.removeAttribute('data-framer-name'); // Убираем имя шаблона
            boxElement.setAttribute('data-box-id', box.id); // Добавляем ID для идентификации
            boxElement.style.display = ''; // Принудительно показываем элемент
            
    
    
            
            // Заполняем данные
            this.fillBoxData(boxElement, box);
            
            // Добавляем в контейнер
            container.appendChild(boxElement);
    
        });

        // Скрываем шаблон и принудительно показываем контейнер
        template.style.display = 'none';
        container.style.display = '';
        container.style.visibility = 'visible';
        container.style.opacity = '1';


    }

    // Обновить title страницы для SEO
    updatePageTitle(boxName) {
        if (boxName) {
            document.title = `${boxName} - Catering Marketplace`;
    
        }
    }

    // Система мониторинга и обновления фотографий
    setupPhotoWatcher() {

        
        // Кеш для хранения данных боксов по ID
        this.photoCache = new Map();
        
        // Набор для отслеживания уже обработанных элементов
        this.processedElements = new WeakSet();
        
        // Дебаунс для избежания слишком частых обновлений
        let updateTimeout = null;
        const debouncedUpdate = (boxId) => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            updateTimeout = setTimeout(() => {
                updateBoxPhotos(boxId);
            }, 100); // Ждем 100мс перед обновлением
        };
        
        // Функция для получения ID бокса из ближайшего родителя
        const getBoxIdFromElement = (element) => {
            let current = element;
            while (current && current !== document.body) {
                const boxId = current.getAttribute('data-box-id');
                if (boxId) return boxId;
                current = current.parentElement;
            }
            return null;
        };
        
        // Функция для обновления фотографий конкретного бокса
        const updateBoxPhotos = async (boxId) => {
            if (!boxId) return;
            
    
            
            // Проверяем кеш
            let boxData = this.photoCache.get(boxId);
            if (!boxData) {
                // Ищем данные бокса
                const boxes = await this.getBoxes();
                boxData = boxes.find(b => String(b.id) === String(boxId));
                if (boxData) {
                    this.photoCache.set(boxId, boxData);
            
                }
            }
            
            if (!boxData) {
        
                return;
            }
            
            // Находим контейнер конкретной карточки
            const boxContainer = document.querySelector(`[data-box-id="${boxId}"]`);
            if (!boxContainer) {
        
                return;
            }
            
    
            
            // Обновляем фотографии только в этом контейнере
            for (let i = 1; i <= 3; i++) {
                const photoKey = `photo${i}`;
                if (boxData[photoKey]) {
                    let imageUrl = boxData[photoKey];
                    if (!imageUrl.startsWith('http')) {
                        imageUrl = `${this.baseUrl}admin/${imageUrl}`;
                    }
                    
                    // Ищем фото-элементы только внутри этого контейнера
                    const photoElements = boxContainer.querySelectorAll(`[data-framer-name="box-${photoKey}"]`);
            
                    
                    photoElements.forEach((element, index) => {
                
                        
                        // Проверяем, нужно ли обновлять
                        let needsUpdate = false;
                        if (element.tagName === 'IMG') {
                            needsUpdate = element.src !== imageUrl;
                        } else {
                            const currentBg = element.style.backgroundImage;
                            const currentUrl = currentBg.replace(/^url\(["']?|["']?\)$/g, '');
                            needsUpdate = currentUrl !== imageUrl;
                        }
                        
                        if (!needsUpdate) {
                    
                            return;
                        }
                        
                        if (element.tagName === 'IMG') {
                            element.src = imageUrl;
                            element.alt = boxData.name;
                        } else {
                            element.style.backgroundImage = `url(${imageUrl})`;
                            element.style.backgroundSize = 'cover';
                            element.style.backgroundPosition = 'center';
                        }
                        
                        // Дополнительно обновляем ВСЕ вложенные изображения в этом элементе
                        const allImages = element.querySelectorAll('img');
                        allImages.forEach(img => {
                            img.src = imageUrl;
                            img.srcset = '';
                            img.removeAttribute('srcset'); // Принудительно удаляем атрибут
                            img.alt = boxData.name;
                        });
                        
                        const allWrappers = element.querySelectorAll('[data-framer-background-image-wrapper="true"]');
                        allWrappers.forEach(wrapper => {
                            wrapper.style.backgroundImage = `url(${imageUrl})`;
                            wrapper.style.backgroundSize = 'cover';
                            wrapper.style.backgroundPosition = 'center center';
                        });
                        
                
                    });
                }
            }
        };
        
        // Создаем MutationObserver для отслеживания изменений DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Отслеживаем добавленные узлы
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Проверяем, является ли элемент фото-элементом
                        const photoElements = ['box-photo1', 'box-photo2', 'box-photo3'];
                        const dataFramerName = node.getAttribute('data-framer-name');
                        
                        if (photoElements.includes(dataFramerName)) {
                    
                            const boxId = getBoxIdFromElement(node);
                            if (boxId) {
                                debouncedUpdate(boxId);
                            }
                        }
                        
                        // Также проверяем вложенные фото-элементы
                        photoElements.forEach(photoName => {
                            const foundElements = node.querySelectorAll(`[data-framer-name="${photoName}"]`);
                            if (foundElements.length > 0) {
                        
                                foundElements.forEach(element => {
                                    const boxId = getBoxIdFromElement(element);
                                    if (boxId) {
                                        debouncedUpdate(boxId);
                                    }
                                });
                            }
                        });
                    }
                });
                
                // Отслеживаем изменения атрибутов (например, style для показа/скрытия)
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    const target = mutation.target;
                    const dataFramerName = target.getAttribute('data-framer-name');
                    
                    if (['box-photo1', 'box-photo2', 'box-photo3'].includes(dataFramerName)) {
                        // Проверяем, стал ли элемент видимым
                        const isVisible = target.style.display !== 'none' && 
                                         target.style.visibility !== 'hidden' &&
                                         target.style.opacity !== '0' &&
                                         !target.hasAttribute('hidden');
                        
                        if (isVisible) {
                    
                            const boxId = getBoxIdFromElement(target);
                            if (boxId) {
                                debouncedUpdate(boxId);
                            }
                        }
                    }
                }
            });
        });
        
        // Запускаем observer
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });
        
        // Дополнительно отслеживаем клики по фото в галерее
        document.addEventListener('click', (e) => {
            const photoElement = e.target.closest('[data-framer-name^="box-photo"]');
            if (photoElement) {
        
                // Небольшая задержка чтобы Framer успел переключить фото
                setTimeout(() => {
                    this.forceUpdateAllImages();
                }, 100);
            }
        });
        

        
        // Сохраняем observer для возможности остановки
        this.photoObserver = observer;
        
        // Первоначальное обновление всех видимых фото
        this.updateAllVisiblePhotos();
    }
    
    // Агрессивное обновление всех изображений на странице
    async forceUpdateAllImages() {

        
        // Получаем все боксы
        const boxes = await this.getBoxes();
        if (!boxes || boxes.length === 0) return;
        
        // Ищем все элементы с data-framer-name="box-photo*"
        const allPhotoElements = document.querySelectorAll('[data-framer-name^="box-photo"]');

        
        allPhotoElements.forEach(element => {
            const photoName = element.getAttribute('data-framer-name');
            const photoNumber = photoName.replace('box-photo', '');
            
            // Пытаемся найти соответствующий бокс (может быть текущий ID из URL)
            const urlParams = new URLSearchParams(window.location.search);
            const currentBoxId = urlParams.get('id');
            
            let currentBox = null;
            if (currentBoxId) {
                currentBox = boxes.find(b => String(b.id) === String(currentBoxId));
            }
            
            if (currentBox && currentBox[`photo${photoNumber}`]) {
                let imageUrl = currentBox[`photo${photoNumber}`];
                if (!imageUrl.startsWith('http')) {
                    imageUrl = `${this.baseUrl}admin/${imageUrl}`;
                }
                
        
                
                // Обновляем сам элемент
                if (element.tagName === 'IMG') {
                    element.src = imageUrl;
                    element.srcset = '';
                    element.removeAttribute('srcset');
                    element.alt = currentBox.name;
                } else {
                    element.style.backgroundImage = `url(${imageUrl})`;
                    element.style.backgroundSize = 'cover';
                    element.style.backgroundPosition = 'center';
                }
                
                // Агрессивно обновляем ВСЕ вложенные img элементы
                const nestedImages = element.querySelectorAll('img');
                nestedImages.forEach((img, index) => {
            
                    img.src = imageUrl;
                    img.srcset = '';
                    img.removeAttribute('srcset');
                    img.removeAttribute('sizes');
                    img.alt = currentBox.name;
                    
                    // Принудительно обновляем через setAttribute
                    img.setAttribute('src', imageUrl);
                    img.setAttribute('alt', currentBox.name);
                });
                
                // Обновляем wrapper элементы
                const wrappers = element.querySelectorAll('[data-framer-background-image-wrapper="true"]');
                wrappers.forEach((wrapper, index) => {
            
                    wrapper.style.backgroundImage = `url(${imageUrl})`;
                    wrapper.style.backgroundSize = 'cover';
                    wrapper.style.backgroundPosition = 'center center';
                });
            }
        });
        

    }

    // Обновить все видимые фотографии на странице
    async updateAllVisiblePhotos() {

        
        // Находим все контейнеры боксов с ID
        const boxContainers = document.querySelectorAll('[data-box-id]');

        
        const processedBoxes = new Set();
        
        boxContainers.forEach(container => {
            const boxId = container.getAttribute('data-box-id');
            if (boxId && !processedBoxes.has(boxId)) {
                // Проверяем, есть ли видимые фото элементы в этом контейнере
                const photoElements = container.querySelectorAll('[data-framer-name^="box-photo"]');
                const hasVisiblePhotos = Array.from(photoElements).some(el => {
                    return el.offsetParent !== null && 
                           el.style.display !== 'none' &&
                           el.style.visibility !== 'hidden';
                });
                
                if (hasVisiblePhotos) {
                    processedBoxes.add(boxId);
            
                    this.updateBoxPhotosById(boxId);
                }
            }
        });
        

    }
    
    // Обновить фотографии конкретного бокса по ID
    async updateBoxPhotosById(boxId) {
        if (!boxId) return;
        

        
        let boxData = this.photoCache.get(boxId);
        if (!boxData) {
            const boxes = await this.getBoxes();
            boxData = boxes.find(b => String(b.id) === String(boxId));
            if (boxData) {
                this.photoCache.set(boxId, boxData);
            }
        }
        
        if (!boxData) return;
        
        // Находим контейнер конкретной карточки
        const boxContainer = document.querySelector(`[data-box-id="${boxId}"]`);
        if (!boxContainer) {
    
            return;
        }
        

        
        for (let i = 1; i <= 3; i++) {
            const photoKey = `photo${i}`;
            if (boxData[photoKey]) {
                let imageUrl = boxData[photoKey];
                if (!imageUrl.startsWith('http')) {
                    imageUrl = `${this.baseUrl}admin/${imageUrl}`;
                }
                
                // Ищем элементы только внутри этого контейнера
                const elements = boxContainer.querySelectorAll(`[data-framer-name="box-${photoKey}"]`);
        
                
                elements.forEach(element => {
                    if (element.tagName === 'IMG') {
                        element.src = imageUrl;
                        element.alt = boxData.name || 'Box Photo';
                    } else {
                        element.style.backgroundImage = `url(${imageUrl})`;
                        element.style.backgroundSize = 'cover';
                        element.style.backgroundPosition = 'center';
                    }
                    
                    // Дополнительно обновляем ВСЕ вложенные изображения в этом элементе
                    const allNestedImages = element.querySelectorAll('img');
                    allNestedImages.forEach(img => {
                        img.src = imageUrl;
                        img.srcset = ''; // Очищаем srcset
                        img.removeAttribute('srcset'); // Принудительно удаляем атрибут
                        img.alt = boxData.name || 'Box Photo';
                    });
                    
                    // Обновляем все wrapper элементы в этом элементе
                    const allWrappers = element.querySelectorAll('[data-framer-background-image-wrapper="true"]');
                    allWrappers.forEach(wrapper => {
                        wrapper.style.backgroundImage = `url(${imageUrl})`;
                        wrapper.style.backgroundSize = 'cover';
                        wrapper.style.backgroundPosition = 'center center';
                    });
                    
            
                });
            }
        }
    }
    
    // Заполнить данные конкретного бокса
    fillBoxData(container, box) {
        if (!box) {
            console.error('❌ No box data provided to fillBoxData');
            return;
        }
        
        // Обновляем title страницы если это детальная страница
        if (container === document) {
            this.updatePageTitle(box.name);
        }
        
        // Функция для поиска элемента по data-framer-name в контейнере
        const findElement = (name) => {
            const element = container.querySelector(`[data-framer-name="${name}"]`);
            return element;
        };

        // Функция для безопасной замены текста с сохранением стилей
        const setTextContent = (element, text) => {
            if (!element) return;
            
            // Ищем внутренний текстовый элемент с различными возможными селекторами
            const textElement = element.querySelector('p.framer-text') || 
                               element.querySelector('p[style*="framer-font"]') ||
                               element.querySelector('p') ||
                               element.querySelector('[class*="framer-text"]') ||
                               element.querySelector('span.framer-text') ||
                               element.querySelector('div.framer-text');
            
            if (textElement) {
                // Заменяем только текст, сохраняя все стили и атрибуты
                textElement.textContent = text;
            } else {
                // Проверяем, может быть элемент сам является текстовым элементом
                if (element.tagName === 'P' || element.classList.contains('framer-text') || element.style.getPropertyValue('--framer-font-family')) {
                    element.textContent = text;
                } else {
                    // Последний fallback - используем обычный способ
                    element.textContent = text;
                }
            }
        };

        // Заполняем текстовые поля
        const nameElement = findElement('box-name') || findElement('name');
        if (nameElement) {
            setTextContent(nameElement, box.name || '');
        }

        const shortDescElement = findElement('box-short-description') || findElement('short-description');
        if (shortDescElement) {
            setTextContent(shortDescElement, box.short_description || '');
        }

        const priceElement = findElement('box-price') || findElement('price');
        if (priceElement) {
            setTextContent(priceElement, box.price ? `${box.price} ₽` : '');
        }

        const badge1Element = findElement('box-badge1') || findElement('badge1');
        if (badge1Element) {
            if (box.badge1) {
                setTextContent(badge1Element, box.badge1);
                badge1Element.style.display = '';
            } else {
                badge1Element.style.display = 'none';
            }
        }

        const badge2Element = findElement('box-badge2') || findElement('badge2');
        if (badge2Element) {
            if (box.badge2) {
                setTextContent(badge2Element, box.badge2);
                badge2Element.style.display = '';
            } else {
                badge2Element.style.display = 'none';
            }
        }

        const detailedDescElement = findElement('box-detailed-description') || findElement('detailed-description');
        if (detailedDescElement) {
            setTextContent(detailedDescElement, box.detailed_description || '');
    
        }

        const whatsInsideElement = findElement('box-whats-inside') || findElement('whats-inside');
        if (whatsInsideElement) {
            setTextContent(whatsInsideElement, box.whats_inside || '');
        }

        const goesWithElement = findElement('box-goes-with') || findElement('goes-with');
        if (goesWithElement) {
            setTextContent(goesWithElement, box.goes_with || '');
        }

        // Заполняем изображения только в рамках текущего контейнера
        for (let i = 1; i <= 3; i++) {
            const photoElement = findElement(`box-photo${i}`) || findElement(`photo${i}`);
            if (photoElement && box[`photo${i}`]) {
                // Формируем полный URL для изображения
                let imageUrl = box[`photo${i}`];
                if (imageUrl && !imageUrl.startsWith('http')) {
                    // Если путь относительный, добавляем базовый URL
                    imageUrl = `${this.baseUrl}admin/${imageUrl}`;
                }
                
                // Показываем элемент (если он был скрыт ранее)
                photoElement.style.display = '';
                photoElement.style.visibility = 'visible';
                
                // Обновляем background-image родительского элемента
                if (photoElement.tagName === 'IMG') {
                    photoElement.src = imageUrl;
                    photoElement.alt = box.name || '';
            
                } else {
                    photoElement.style.backgroundImage = `url(${imageUrl})`;
                    photoElement.style.backgroundSize = 'cover';
                    photoElement.style.backgroundPosition = 'center';
            
                }
                
                    // Дополнительно обновляем ВСЕ вложенные изображения ТОЛЬКО в этом photoElement
                    const allNestedImages = photoElement.querySelectorAll('img');
                    allNestedImages.forEach((img, imgIndex) => {
                        img.src = imageUrl;
                        img.srcset = ''; // Очищаем srcset чтобы не было конфликта
                        img.removeAttribute('srcset'); // Принудительно удаляем атрибут
                        img.alt = box.name || '';
                
                    });                // Обновляем все wrapper элементы с background-image ТОЛЬКО в этом photoElement
                const allWrappers = photoElement.querySelectorAll('[data-framer-background-image-wrapper="true"]');
                allWrappers.forEach((wrapper, wrapperIndex) => {
                    wrapper.style.backgroundImage = `url(${imageUrl})`;
                    wrapper.style.backgroundSize = 'cover';
                    wrapper.style.backgroundPosition = 'center center';
            
                });
                
            } else if (photoElement) {
                // Если фото нет - скрываем или удаляем элемент
                if (container === document) {
                    // На странице деталей полностью скрываем элемент
                    photoElement.style.display = 'none';
                    photoElement.style.visibility = 'hidden';
                    
                    // Опционально: можно полностью удалить элемент
                    // photoElement.remove();
                } else {
                    // В списке боксов просто скрываем
                    photoElement.style.display = 'none';
                }
            }
        }



        // Обновляем ссылки - делаем всю карточку кликабельной, кроме кнопок корзины
        const linkElements = container.querySelectorAll('[data-framer-name*="box-link"]');

        linkElements.forEach((link, index) => {
    
            
            if (link.tagName === 'A') {
                const currentHref = link.getAttribute('href') || '';
                link.setAttribute('href', `${currentHref}${currentHref.includes('?') ? '&' : '?'}id=${box.id}`);
        
            }
            // Для div элементов (вся карточка) добавляем обработчик клика
            if (link.tagName === 'DIV') {
                link.style.cursor = 'pointer';
                
                // Удаляем старые обработчики
                link.onclick = null;
                
        
                // Добавляем новый обработчик с проверкой на кнопки корзины
                link.addEventListener('click', (e) => {
            
                    
                    // Проверяем, был ли клик по кнопке корзины или её потомкам
                    const cartButton = e.target.closest('[data-framer-name="box-add-to-cart-button"]') ||
                                      e.target.closest('[data-framer-name="box-add-to-cart"]') ||
                                      e.target.closest('[data-framer-name="box-plus"]') ||
                                      e.target.closest('[data-framer-name="box-minus"]') ||
                                      e.target.closest('[data-framer-name="box-quantity"]');
                    
                    if (cartButton) {
                        // Клик был по кнопке корзины - обрабатываем корзину и не переходим на детальную страницу
                
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Делегируем обработку корзины
                        if (window.cartManager) {
                            window.cartManager.handleClick(e);
                        }
                        return;
                    }
                    
                    // Клик был по карточке - переходим на детальную страницу
            
                    const slug = this.generateSlug(box.name);
                    // Используем красивый URL с параметрами вместо dynamic routing
                    window.location.href = `/box-details?box=${slug}&id=${box.id}`;
                });
        
            }
        });
        
        // Если это детальная страница, запускаем агрессивное обновление изображений
        if (container === document) {
    
            setTimeout(() => {
                this.forceUpdateAllImages();
            }, 500);
            
            // Добавляем глобальный обработчик событий корзины для детальной страницы (только один раз)
            if (!window.detailPageCartHandlerAdded) {
        
                document.addEventListener('click', (e) => {
                    // Проверяем, был ли клик по кнопкам корзины
                    const cartButton = e.target.closest('[data-framer-name="box-add-to-cart-button"]') ||
                                      e.target.closest('[data-framer-name="box-add-to-cart"]') ||
                                      e.target.closest('[data-framer-name="box-plus"]') ||
                                      e.target.closest('[data-framer-name="box-minus"]');
                    
                    if (cartButton) {
                
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Делегируем обработку корзины
                        if (window.cartManager) {
                            window.cartManager.handleClick(e);
                        }
                    }
                }, { capture: true }); // Используем capture для приоритетной обработки
                
                window.detailPageCartHandlerAdded = true;
        
            }
        }
        

    }

    // Заполнить элементы мероприятий на странице
    async populateEvents(containerName, templateName) {
        const events = await this.getEvents();
        const container = document.querySelector(`[data-framer-name="${containerName}"]`);
        const template = document.querySelector(`[data-framer-name="${templateName}"]`);
        
        if (!container || !template) {
            console.error('Container or template not found:', containerName, templateName);
            return;
        }

        // Очищаем контейнер, кроме шаблона
        const children = Array.from(container.children);
        children.forEach(child => {
            if (child !== template && !child.hasAttribute('data-framer-name')) {
                child.remove();
            }
        });

        // Создаем элементы для каждого мероприятия
        events.forEach((event, index) => {
            const eventElement = template.cloneNode(true);
            eventElement.style.display = ''; // Показываем элемент
            eventElement.removeAttribute('data-framer-name'); // Убираем имя шаблона
            eventElement.setAttribute('data-event-id', event.id); // Добавляем ID для идентификации
            
            // Заполняем данные
            this.fillEventData(eventElement, event);
            
            // Добавляем в контейнер
            container.appendChild(eventElement);
        });

        // Скрываем шаблон
        template.style.display = 'none';
    }

    // Заполнить данные конкретного мероприятия
    fillEventData(container, event) {
        // Функция для поиска элемента по data-framer-name в контейнере
        const findElement = (name) => {
            return container.querySelector(`[data-framer-name="${name}"]`);
        };

        const upperElement = findElement('event-upper') || findElement('upper');
        if (upperElement) upperElement.textContent = event.upper || '';

        const lowerElement = findElement('event-lower') || findElement('lower');
        if (lowerElement) lowerElement.textContent = event.lower || '';

        const quantityElement = findElement('event-quantity') || findElement('quantity');
        if (quantityElement) quantityElement.textContent = event.quantity ? `${event.quantity} гостей` : '';

        // Заполняем фотографии
        if (event.photos && event.photos.length > 0) {
            const mainPhotoElement = findElement('event-main-photo') || findElement('main-photo');
            if (mainPhotoElement) {
                if (mainPhotoElement.tagName === 'IMG') {
                    mainPhotoElement.src = event.photos[0];
                    mainPhotoElement.alt = event.upper || '';
                } else {
                    mainPhotoElement.style.backgroundImage = `url(${event.photos[0]})`;
                    mainPhotoElement.style.backgroundSize = 'cover';
                    mainPhotoElement.style.backgroundPosition = 'center';
                }
            }

            // Галерея фотографий
            const galleryElement = findElement('event-photo-gallery') || findElement('photo-gallery');
            if (galleryElement) {
                galleryElement.innerHTML = '';
                event.photos.forEach(photo => {
                    const img = document.createElement('img');
                    img.src = photo;
                    img.alt = event.upper || '';
                    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                    galleryElement.appendChild(img);
                });
            }
        }

        // Обновляем ссылки
        const linkElements = container.querySelectorAll('[data-framer-name*="event-link"]');
        linkElements.forEach(link => {
            if (link.tagName === 'A') {
                const currentHref = link.getAttribute('href') || '';
                link.setAttribute('href', `${currentHref}${currentHref.includes('?') ? '&' : '?'}id=${event.id}`);
            }
            // Для div элементов добавляем обработчик клика
            if (link.tagName === 'DIV') {
                link.style.cursor = 'pointer';
                link.onclick = () => {
                    window.location.href = `/event-details?id=${event.id}`;
                };
            }
        });
    }

    // Заполнить данные на детальной странице бокса по slug
    async populateBoxDetailsBySlug(slug) {

        
        // Получаем все боксы и ищем подходящий
        const boxes = await this.getBoxes();

        
        // Показываем все сгенерированные slug'и для диагностики
        const slugMap = boxes.map(b => ({
            name: b.name,
            slug: this.generateSlug(b.name),
            id: b.id
        }));

        
        const box = boxes.find(b => this.generateSlug(b.name) === slug);
        
        if (!box) {
            console.error('❌ Box not found by slug:', slug);
    
            
            // Попробуем fallback к mock данным
    
            this.useMockData = true;
            const mockBoxes = await this.getBoxes();
            const mockBox = mockBoxes.find(b => this.generateSlug(b.name) === slug);
            if (mockBox) {
        
                this.fillBoxData(document, mockBox);
                return;
            }
            
            return;
        }
        

        this.fillBoxData(document, box);
    }

    // Заполнить данные на детальной странице бокса по ID
    async populateBoxDetails(boxId) {

        
        // Получаем все боксы и ищем по ID
        const boxes = await this.getBoxes();

        
        // Показываем все доступные ID для диагностики


        
        const box = boxes.find(b => {
            const match = b.id === boxId || b.id === String(boxId) || String(b.id) === String(boxId);
            if (match) {
        
            }
            return match;
        });
        
        if (!box) {
            console.error('❌ Box not found by ID:', boxId);
    
            
            // Попробуем fallback к mock данным
    
            this.useMockData = true;
            const mockBoxes = await this.getBoxes();
            const mockBox = mockBoxes.find(b => String(b.id) === String(boxId));
            if (mockBox) {
        
                this.fillBoxData(document, mockBox);
                return;
            }
            
            return;
        }
        

        this.fillBoxData(document, box);
    }

    // Заполнить данные на детальной странице мероприятия
    async populateEventDetails(eventId) {
        const event = await this.getEvent(eventId);
        if (!event) {
            console.error('Event not found');
            return;
        }

        this.fillEventData(document, event);
    }

    // Получить параметр из URL
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Диагностика проблемы - новая функция
    diagnoseIssue() {

        
        // 1. Проверяем элементы
        const container = document.querySelector('[data-framer-name="boxes-container"]');
        const template = document.querySelector('[data-framer-name="box-template"]');
        



        
        if (container) {
    
    
    
    
            
            // Показываем все дочерние элементы
            Array.from(container.children).forEach((child, index) => {
        
        
        
        
            });
        }
        
        if (template) {
    
    
        }
        
        // 2. Проверяем данные


        
        // 3. Проверяем, что видит пользователь

        const visibleBoxes = document.querySelectorAll('[data-box-id]');

        visibleBoxes.forEach((box, index) => {
            const rect = box.getBoundingClientRect();
    
        });
        
        // 4. Проверяем стили контейнера
        if (container) {
            const containerStyles = getComputedStyle(container);
    
    
    
    
    
        }
        

    }

    // Принудительное исправление отображения
    forceShow() {

        
        const container = document.querySelector('[data-framer-name="boxes-container"]');
        const template = document.querySelector('[data-framer-name="box-template"]');
        
        if (container) {
            // Принудительно показываем контейнер
            container.style.display = 'grid !important';
            container.style.visibility = 'visible !important';
            container.style.opacity = '1 !important';
            container.style.zIndex = '999';
            
            // Показываем все дочерние элементы кроме template
            Array.from(container.children).forEach(child => {
                if (child !== template) {
                    child.style.display = 'block !important';
                    child.style.visibility = 'visible !important';
                    child.style.opacity = '1 !important';
                }
            });
            
    
        }
        
        if (template) {
            template.style.display = 'none !important';
    
        }
    }

    // Инициализация на основе текущей страницы
    async autoInit() {





        
        // Ищем только нужные нам элементы
        const requiredElements = [
            'boxes-container', 'box-template', 'box-link',
            'events-container', 'event-template', 'event-link',
            'box-name', 'box-price', 'box-short-description'
        ];
        

        const foundElements = {};
        requiredElements.forEach(name => {
            const element = document.querySelector(`[data-framer-name="${name}"]`);
            foundElements[name] = element;
            if (element) {
        
            } else {
        
            }
        });
        
        const boxId = this.getUrlParameter('box_id') || this.getUrlParameter('id');
        const boxSlug = this.getUrlParameter('box'); // Получаем slug бокса
        const eventId = this.getUrlParameter('event_id') || this.getUrlParameter('id');
        


        // Если это страница деталей бокса (определяем по наличию элементов с соответствующими именами или URL)
        const isBoxDetailsPage = (boxId || boxSlug) && (
            foundElements['box-name'] || 
            foundElements['box-price'] || 
            document.querySelector('[data-framer-name="box-details-page"]') ||
            window.location.pathname.includes('/box-details') ||
            window.location.search.includes('box=')
        );
        
        if (isBoxDetailsPage) {
    
            
            // Приоритет: сначала пробуем по ID, потом по slug
            if (boxId) {
        
                await this.populateBoxDetails(boxId);
            } 
            // Если есть только slug, попробуем найти бокс по названию
            else if (boxSlug) {
        
                await this.populateBoxDetailsBySlug(boxSlug);
            }
            
            // Дополнительная проверка - если данные всё ещё не загрузились, попробуем slug
            setTimeout(async () => {
                const nameElement = document.querySelector('[data-framer-name="box-name"]');
                if (nameElement && (!nameElement.textContent || nameElement.textContent.trim() === '')) {
            
                    if (boxSlug) {
                        await this.populateBoxDetailsBySlug(boxSlug);
                    }
                }
                
                // Обеспечиваем работу корзины на детальной странице
                if (window.cartManager) {
            
                    window.cartManager.updateUI();
                    window.cartManager.updateCartButton();
                }
            }, 500);
        }
        
        // Если это страница деталей мероприятия
        if (eventId && (document.querySelector('[data-framer-name*="event-"]') || document.querySelector('[data-framer-name="event-details-page"]'))) {
    
            await this.populateEventDetails(eventId);
        }

        // Проверяем контейнеры и шаблоны боксов
        const boxContainer = foundElements['boxes-container'];
        const boxTemplate = foundElements['box-template'];
        



        
        if (boxContainer && boxTemplate) {
    
            await this.populateBoxes('boxes-container', 'box-template');
        } else {
            if (!boxContainer) console.error('  📦 Missing: boxes-container element');
            if (!boxTemplate) console.error('  📝 Missing: box-template element');
        }

        // Проверяем контейнеры и шаблоны мероприятий
        const eventContainer = foundElements['events-container'];
        const eventTemplate = foundElements['event-template'];
        



        
        if (eventContainer && eventTemplate) {
    
            await this.populateEvents('events-container', 'event-template');
        } else {
            if (!eventContainer) console.error('  🎪 Missing: events-container element');
            if (!eventTemplate) console.error('  📝 Missing: event-template element');
        }
        
        // Запускаем систему мониторинга фотографий
        this.setupPhotoWatcher();
        
        // Убеждаемся, что корзина инициализирована для текущей страницы
        if (window.cartManager) {
    
            setTimeout(() => {
                window.cartManager.updateUI();
                window.cartManager.updateCartButton();
            }, 300);
        }
        

    }

    // Очистка кешей и состояния при смене страницы
    resetState() {

        
        // Очищаем кеш фотографий
        if (this.photoCache) {
            this.photoCache.clear();
    
        }
        
        // Сбрасываем набор обработанных элементов
        this.processedElements = new WeakSet();

        
        // Останавливаем observer если активен
        if (this.photoObserver) {
            this.photoObserver.disconnect();
            this.photoObserver = null;
    
        }
        
        // Сбрасываем флаг обработчика детальной страницы
        window.detailPageCartHandlerAdded = false;

        

    }

    // Методы для ручного вызова
    async loadBoxesInto(containerName, templateName) {
        await this.populateBoxes(containerName, templateName);
    }

    async loadEventsInto(containerName, templateName) {
        await this.populateEvents(containerName, templateName);
    }

    async loadBoxDetails(boxId) {
        await this.populateBoxDetails(boxId);
    }

    async loadEventDetails(eventId) {
        await this.populateEventDetails(eventId);
    }
}

// Класс для управления корзиной
class CartManager {
    constructor() {
        this.storageKey = 'catering_cart';
        this.cart = this.loadCart();
        this.init();
    }

    // Загрузить корзину из localStorage
    loadCart() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('❌ Error loading cart:', error);
            return {};
        }
    }

    // Сохранить корзину в localStorage
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        } catch (error) {
            console.error('❌ Error saving cart:', error);
        }
    }

    // Добавить товар в корзину
    addItem(boxId, quantity = 1) {
        if (this.cart[boxId]) {
            this.cart[boxId] += quantity;
        } else {
            this.cart[boxId] = quantity;
        }
        this.saveCart();
        this.updateUI();
        this.updateCartButton();
    }

    // Убрать товар из корзины
    removeItem(boxId, quantity = 1) {
        if (this.cart[boxId]) {
            this.cart[boxId] -= quantity;
            if (this.cart[boxId] <= 0) {
                delete this.cart[boxId];
            }
        }
        this.saveCart();
        this.updateUI();
        this.updateCartButton();
    }

    // Установить количество товара в корзине
    setItemQuantity(boxId, quantity) {
        if (quantity <= 0) {
            delete this.cart[boxId];
        } else {
            this.cart[boxId] = quantity;
        }
        this.saveCart();
        this.updateUI();
        this.updateCartButton();
    }

    // Получить количество товара в корзине
    getItemQuantity(boxId) {
        return this.cart[boxId] || 0;
    }

    // Получить общее количество товаров
    getTotalQuantity() {
        return Object.values(this.cart).reduce((total, quantity) => total + quantity, 0);
    }

    // Проверить, есть ли товар в корзине
    hasItem(boxId) {
        return boxId in this.cart && this.cart[boxId] > 0;
    }

    // Очистить корзину
    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateUI();
        this.updateCartButton();
    }

    // Найти ID бокса из ближайшего родителя
    findBoxId(element) {
        let current = element;
        while (current && current !== document.body) {
            const boxId = current.getAttribute('data-box-id');
            if (boxId) {
                return boxId;
            }
            current = current.parentElement;
        }
        
        // Если не нашли в родителях, попробуем получить из URL (для страницы деталей)
        const urlParams = new URLSearchParams(window.location.search);
        const urlBoxId = urlParams.get('id');
        return urlBoxId;
    }

    // Обновить UI корзины для конкретного бокса
    updateBoxUI(boxId) {
        const quantity = this.getItemQuantity(boxId);
        const isInCart = this.hasItem(boxId);
        
        // Ищем все возможные контейнеры для этого бокса
        const searchContainers = [];
        
        // 1. Элементы с data-box-id
        const boxElements = document.querySelectorAll(`[data-box-id="${boxId}"]`);
        searchContainers.push(...boxElements);
        
        // 2. Если мы на странице деталей этого бокса
        if (window.location.search.includes(`id=${boxId}`)) {
            searchContainers.push(document.body);
        }
        
        // 3. Если контейнеров не найдено, ищем во всем документе
        if (searchContainers.length === 0) {
            searchContainers.push(document.body);
        }
        
        searchContainers.forEach((container, containerIndex) => {
            // Ищем элементы управления корзиной только по data-framer-name
            const addToCartBtn = container.querySelector('[data-framer-name="box-add-to-cart-button"]') ||
                                container.querySelector('[data-framer-name="box-add-to-cart"]');
            
            const quantityWrapper = container.querySelector('[data-framer-name="box-quantity"]');
            
            const quantityNumber = container.querySelector('[data-framer-name="box-quantity-number"]') ||
                                 (quantityWrapper && quantityWrapper.querySelector('p'));
            
            if (addToCartBtn && quantityWrapper) {
                if (isInCart) {
                    // Товар в корзине - показываем quantity, скрываем кнопку
                    addToCartBtn.style.display = 'none';
                    addToCartBtn.style.visibility = 'hidden';
                    quantityWrapper.style.display = 'flex';
                    quantityWrapper.style.visibility = 'visible';
                    quantityWrapper.style.opacity = '1';
                    
                    if (quantityNumber) {
                        const textElement = quantityNumber.querySelector('p') || 
                                          quantityNumber.querySelector('span') || 
                                          quantityNumber;
                        if (textElement) {
                            textElement.textContent = quantity.toString();
                        }
                    }
                } else {
                    // Товара нет в корзине - показываем кнопку, скрываем quantity
                    addToCartBtn.style.display = 'flex';
                    addToCartBtn.style.visibility = 'visible';
                    addToCartBtn.style.opacity = '1';
                    quantityWrapper.style.display = 'none';
                    quantityWrapper.style.visibility = 'hidden';
                }
            }
        });
    }

    // Обновить UI всех боксов
    updateUI() {
        // Обновляем все боксы в корзине
        Object.keys(this.cart).forEach(boxId => {
            this.updateBoxUI(boxId);
        });
        
        // Также проверяем видимые боксы, которых может не быть в корзине
        const allBoxElements = document.querySelectorAll('[data-box-id]');
        allBoxElements.forEach(element => {
            const boxId = element.getAttribute('data-box-id');
            if (boxId && !this.hasItem(boxId)) {
                this.updateBoxUI(boxId);
            }
        });
        
        // Обновляем страницу деталей если мы на ней
        const urlParams = new URLSearchParams(window.location.search);
        const currentBoxId = urlParams.get('id');
        if (currentBoxId) {
            this.updateBoxUI(currentBoxId);
        }
    }

    // Обновить кнопку корзины
    updateCartButton() {
        // Ищем кнопку корзины только по data-framer-name
        const cartButton = document.querySelector('[data-framer-name="box-cart-open-button"]') ||
                          document.querySelector('[data-framer-name="cart-button"]') ||
                          document.querySelector('[data-framer-name="box-cart-button"]');
        
        const cartQuantityWrapper = document.querySelector('[data-framer-name="box-cart-quantity-wrapper"]') ||
                                   document.querySelector('[data-framer-name="cart-quantity-wrapper"]') ||
                                   document.querySelector('[data-framer-name="box-cart-quantity"]');
        
        const cartQuantityNumber = document.querySelector('[data-framer-name="box-cart-quantity-number"]') ||
                                  document.querySelector('[data-framer-name="cart-quantity-number"]') ||
                                  (cartQuantityWrapper && cartQuantityWrapper.querySelector('p'));
        
        if (!cartButton) {
            return;
        }
        
        const totalQuantity = this.getTotalQuantity();
        
        if (totalQuantity > 0) {
            // Корзина не пуста - показываем количество
            if (cartQuantityWrapper) {
                cartQuantityWrapper.style.display = 'flex';
                cartQuantityWrapper.style.visibility = 'visible';
                cartQuantityWrapper.style.opacity = '1';
            }
            
            if (cartQuantityNumber) {
                const textElement = cartQuantityNumber.querySelector('p') || cartQuantityNumber;
                if (textElement) {
                    textElement.textContent = totalQuantity.toString();
                }
            }
        } else {
            // Корзина пуста - скрываем количество
            if (cartQuantityWrapper) {
                cartQuantityWrapper.style.display = 'none';
                cartQuantityWrapper.style.visibility = 'hidden';
            }
        }
        
        // Обновляем модальное окно корзины, если оно открыто
        this.updateCartModal();
    }
    
    // Обновить модальное окно корзины
    async updateCartModal() {
        const cartModal = document.querySelector('[data-framer-name="cart-modal-windows"]') ||
                         document.querySelector('[data-framer-name="cart-modal"]');
        
        if (!cartModal) {
            return;
        }
        
        const isEmpty = this.getTotalQuantity() === 0;
        
        // Показываем/скрываем пустую/полную корзину
        const cartEmpty = cartModal.querySelector('[data-framer-name="cart-empty"]');
        const cartFull = cartModal.querySelector('[data-framer-name="cart-full"]');
        
        if (cartEmpty && cartFull) {
            if (isEmpty) {
                cartEmpty.style.display = 'flex';
                cartFull.style.display = 'none';
            } else {
                cartEmpty.style.display = 'none';
                cartFull.style.display = 'flex';
                
                // Заполняем товары в корзине
                await this.populateCartItems(cartModal);
                
                // Обновляем общую сумму
                this.updateCartTotal(cartModal);
            }
        }
        
        // Обновляем данные для формы
        this.updateCartFormData();
    }
    
    // Заполнить товары в корзине
    async populateCartItems(cartModal) {
        const templateWrapper = cartModal.querySelector('[data-framer-name="cart-template-wrapper"]');
        const template = cartModal.querySelector('[data-framer-name="cart-template"]');
        
        if (!templateWrapper || !template) {
            return;
        }
        
        template.style.display = 'none';
        
        // Очищаем старые элементы
        const existingItems = templateWrapper.querySelectorAll('[data-cart-item-id]');
        existingItems.forEach(item => item.remove());
        
        const boxes = await window.cms.getBoxes();
        let totalSum = 0;
        
        // Создаем элементы для каждого товара в корзине
        for (const [boxId, quantity] of Object.entries(this.cart)) {
            const box = boxes.find(b => String(b.id) === String(boxId));
            if (!box) continue;
            
            const itemElement = template.cloneNode(true);
            itemElement.style.display = 'flex';
            itemElement.setAttribute('data-cart-item-id', boxId);
            itemElement.removeAttribute('data-framer-name');
            
            this.fillCartItemData(itemElement, box, quantity);
            templateWrapper.appendChild(itemElement);
            
            const itemSum = (box.price || 0) * quantity;
            totalSum += itemSum;
        }
        
        return totalSum;
    }
    
    // Заполнить данные конкретного товара в корзине
    fillCartItemData(itemElement, box, quantity) {
        // Фото товара
        const imageElement = itemElement.querySelector('[data-framer-name="cart-box-image"]');
        if (imageElement && box.photo1) {
            let imageUrl = box.photo1;
            if (!imageUrl.startsWith('http')) {
                imageUrl = `${window.cms.baseUrl}admin/${imageUrl}`;
            }
            
            // Находим img элемент внутри wrapper'а
            const imgElement = imageElement.querySelector('img');
            if (imgElement) {
                imgElement.src = imageUrl;
                imgElement.srcset = ''; // Очищаем srcset который мешает
                imgElement.alt = box.name;
            }
            
            // Также обновляем background-image у wrapper'а
            const imgWrapper = imageElement.querySelector('[data-framer-background-image-wrapper="true"]');
            if (imgWrapper) {
                imgWrapper.style.backgroundImage = `url("${imageUrl}")`;
            }
        }
        
        // Название товара
        const titleElement = itemElement.querySelector('[data-framer-name="cart-box-title"]');
        if (titleElement) {
            const textElement = titleElement.querySelector('p') || titleElement;
            textElement.textContent = box.name || '';
        }
        
        // Цена товара
        const priceElement = itemElement.querySelector('[data-framer-name="cart-box-price"]');
        if (priceElement) {
            const textElement = priceElement.querySelector('p') || priceElement;
            textElement.textContent = box.price ? `${box.price} ₽` : '0 ₽';
        }
        
        // Количество
        const quantityElement = itemElement.querySelector('[data-framer-name="cart-box-quantity"]');
        if (quantityElement) {
            const textElement = quantityElement.querySelector('p') || quantityElement;
            textElement.textContent = quantity.toString();
        }
        
        // Сумма товара
        const sumElement = itemElement.querySelector('[data-framer-name="cart-box-sum"]');
        if (sumElement) {
            const textElement = sumElement.querySelector('p') || sumElement;
            const itemSum = (box.price || 0) * quantity;
            textElement.textContent = `${itemSum} ₽`;
        }
        
        // Добавляем обработчики кликов для кнопок + и -
        const plusBtn = itemElement.querySelector('[data-framer-name="cart-box-quantity-plus"]');
        const minusBtn = itemElement.querySelector('[data-framer-name="cart-box-quantity-minus"]');
        
        if (plusBtn) {
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addItem(box.id, 1);
            });
        }
        
        if (minusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeItem(box.id, 1);
            });
        }
    }
    
    // Обновить общую сумму корзины
    updateCartTotal(cartModal) {
        const cartSum = cartModal.querySelector('[data-framer-name="cart-sum"]');
        if (!cartSum) {
            return;
        }
        
        let totalSum = 0;
        
        // Считаем общую сумму из всех товаров
        Object.entries(this.cart).forEach(([boxId, quantity]) => {
            // Находим цену из данных на странице или используем сохраненную
            const cartItem = document.querySelector(`[data-cart-item-id="${boxId}"]`);
            if (cartItem) {
                const priceText = cartItem.querySelector('[data-framer-name="cart-box-price"] p')?.textContent || '';
                const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
                totalSum += price * quantity;
            }
        });
        
        const textElement = cartSum.querySelector('p') || cartSum;
        textElement.textContent = `Сумма: ${totalSum} ₽`;
        
        return totalSum;
    }
    
    // Обновить данные корзины для формы
    updateCartFormData() {
        // Формируем данные корзины
        const cartData = [];
        let totalSum = 0;
        
        Object.entries(this.cart).forEach(([boxId, quantity]) => {
            const cartItem = document.querySelector(`[data-cart-item-id="${boxId}"]`);
            if (cartItem) {
                const title = cartItem.querySelector('[data-framer-name="cart-box-title"] p')?.textContent || `Box ${boxId}`;
                const priceText = cartItem.querySelector('[data-framer-name="cart-box-price"] p')?.textContent || '';
                const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
                const itemSum = price * quantity;
                
                cartData.push(`${title} - ${quantity}шт x ${price}₽`);
                totalSum += itemSum;
            }
        });
        
        if (cartData.length > 0) {
            cartData.push(`\nИтого: ${totalSum}₽`);
        }
        
        const cartText = cartData.join('\n');
        
        // Создаем или обновляем textarea на основной странице
        let cartTextarea = document.querySelector('textarea[name="Cart"]');
        if (!cartTextarea) {
            cartTextarea = document.createElement('textarea');
            cartTextarea.name = 'Cart';
            cartTextarea.style.display = 'none';
            document.body.appendChild(cartTextarea);
        }
        cartTextarea.value = cartText;
        
        // Также сохраняем глобально
        window.currentCartData = cartText;
    }

    // Диагностика элементов корзины на странице
    diagnoseCartElements() {
        // Поиск всех элементов с data-framer-name
        const allFramerElements = document.querySelectorAll('[data-framer-name]');
        
        const cartRelatedElements = [];
        const boxRelatedElements = [];
        const quantityRelatedElements = [];
        
        allFramerElements.forEach(element => {
            const name = element.getAttribute('data-framer-name');
            if (name.includes('cart')) {
                cartRelatedElements.push({ name, element });
            }
            if (name.includes('box')) {
                boxRelatedElements.push({ name, element });
            }
            if (name.includes('quantity')) {
                quantityRelatedElements.push({ name, element });
            }
        });
    }

    // Инициализация обработчиков событий
    init() {
        // Наблюдаем за появлением модального окна корзины
        this.observeCartModal();
        
        // Обновляем UI при инициализации
        setTimeout(() => {
            this.updateUI();
            this.updateCartButton();
        }, 500);
    }
    
    // Наблюдать за появлением модального окна корзины
    observeCartModal() {
        // Глобальный флаг для предотвращения повторной обработки
        if (window.cartModalObserverActive) {
            return;
        }
        window.cartModalObserverActive = true;
        
        let isUpdating = false;
        let updateTimeout = null;
        
        // Создаем observer для отслеживания появления модального окна
        const observer = new MutationObserver((mutations) => {
            if (isUpdating) return;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Проверяем, не добавили ли модальное окно корзины
                        const cartModal = node.querySelector && node.querySelector('[data-framer-name="cart-modal-windows"]') || 
                                         (node.matches && node.matches('[data-framer-name="cart-modal-windows"]')) ? node : null;
                        
                        if (cartModal && !isUpdating) {
                            isUpdating = true;
                            
                            // Отменяем предыдущий таймер если есть
                            if (updateTimeout) {
                                clearTimeout(updateTimeout);
                            }
                            
                            updateTimeout = setTimeout(() => {
                                this.updateCartModal();
                                this.setupClearCartButton(cartModal);
                                isUpdating = false;
                                updateTimeout = null;
                            }, 300);
                        }
                    }
                });
            });
        });
        
        // Запускаем наблюдение за изменениями в документе
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Настроить кнопку очистки корзины
    setupClearCartButton(cartModal) {
        // Создаем глобальные функции очистки корзины
        window.clearCartGlobal = () => {
            this.clearCart();
            return true;
        };
        
        window.clearCart = () => {
            this.clearCart();
            return true;
        };
        
        window.clearCartFromForm = () => {
            this.clearCart();
            return true;
        };
    }

    // Обработка кликов
    handleClick(e) {
        const target = e.target;
        
        // Поиск кнопки "Добавить в корзину" только по data-framer-name
        const addToCartBtn = target.closest('[data-framer-name="box-add-to-cart-button"]') ||
                            target.closest('[data-framer-name="box-add-to-cart"]');
        
        if (addToCartBtn) {
            // Проверяем, что это именно кнопка корзины
            const buttonText = addToCartBtn.textContent?.toLowerCase() || '';
            if (buttonText.includes('корзин') || buttonText.includes('добавить')) {
                e.preventDefault();
                e.stopPropagation();
                
                const boxId = this.findBoxId(addToCartBtn);
                if (boxId) {
                    this.addItem(boxId, 1);
                    
                    // Немедленно обновляем UI для этого конкретного бокса
                    setTimeout(() => {
                        this.updateBoxUI(boxId);
                    }, 100);
                }
                return;
            }
        }
        
        // Кнопка "плюс"
        const plusBtn = target.closest('[data-framer-name="box-plus"]');
        if (plusBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const boxId = this.findBoxId(plusBtn);
            if (boxId) {
                this.addItem(boxId, 1);
            }
            return;
        }
        
        // Кнопка "минус"
        const minusBtn = target.closest('[data-framer-name="box-minus"]');
        if (minusBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const boxId = this.findBoxId(minusBtn);
            if (boxId) {
                this.removeItem(boxId, 1);
            }
            return;
        }
    }
}

// Инициализация CMS
const cms = new FramerCMS('https://catering-marketplace.me/');

// Инициализация корзины
window.cartManager = new CartManager();
window.cartManager.init();

// Функция для обработки изменения страницы
const handlePageChange = () => {
    // Сбрасываем состояние CMS
    cms.resetState();
    
    // Переинициализируем корзину для новой страницы
    if (window.cartManager) {
        setTimeout(() => {
            window.cartManager.updateUI();
            window.cartManager.updateCartButton();
        }, 200);
    }
    
    // Перезапускаем autoInit с задержкой для загрузки DOM
    setTimeout(() => {
        cms.autoInit().catch(error => {
            console.error('❌ AutoInit failed after page change:', error);
        });
    }, 100);
};

// Обработчик для кнопки "Назад/Вперед" браузера
window.addEventListener('popstate', (event) => {
    handlePageChange();
});

// Обработчик для программной навигации (если Framer использует History API)
let currentUrl = window.location.href;
const urlChangeDetector = setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        handlePageChange();
    }
}, 1000);

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    cms.autoInit().catch(error => {
        console.error('❌ AutoInit failed:', error);
    });
});

// Резервная инициализация для случаев, когда DOM уже загружен
if (document.readyState !== 'loading') {
    cms.autoInit().catch(error => {
        console.error('❌ Immediate AutoInit failed:', error);
    });
}

// Дополнительная инициализация после полной загрузки всех ресурсов
window.addEventListener('load', () => {
    // Проверяем, есть ли элементы, но нет данных
    const container = document.querySelector('[data-framer-name="boxes-container"]');
    const template = document.querySelector('[data-framer-name="box-template"]');
    
    if (container && template) {
        const hasData = container.children.length > 1;
        
        if (!hasData) {
            setTimeout(() => {
                cms.autoInit().catch(error => {
                    console.error('❌ Retry AutoInit failed:', error);
                });
            }, 1000);
        }
    }
});

// Экспортируем для глобального использования
window.FramerCMS = FramerCMS;
window.cms = cms;

// Глобальная функция очистки корзины
window.clearCartGlobal = () => {
    if (window.cartManager) {
        window.cartManager.clearCart();
        return true;
    }
    return false;
};

// Добавляем функции для ручного тестирования в консоли
window.testCMS = {
    // Тест получения данных с API
    async testAPI() {

        try {
    
            const response = await fetch('https://catering-marketplace.me/admin/boxes.json');
    
    
            
            const text = await response.text();
    
            
            let data;
            try {
                data = JSON.parse(text);
        
                
                // Преобразуем объект в массив для лучшего отображения
                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                    const boxesArray = Object.keys(data).map(key => ({
                        id: key,
                        name: data[key].name,
                        price: data[key].price
                    }));
            
                }
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
        
                return null;
            }
            
            if (data && data.error) {
                console.error('❌ API returned error:', data.error);
        
                return null;
            }
            
    
            return data;
        } catch (error) {
            console.error('❌ API test failed:', error);
            return null;
        }
    },
    
    // Поиск элементов на странице
    findElements() {

        
        const cmsElements = [
            'boxes-container', 'box-template', 'box-link', 'box-name', 'box-price',
            'events-container', 'event-template', 'event-link'
        ];
        

        const found = {};
        cmsElements.forEach(name => {
            const element = document.querySelector(`[data-framer-name="${name}"]`);
            found[name] = element;
            if (element) {
        
            } else {
        
            }
        });
        
        return found;
    },
    
    // Принудительный запуск populateBoxes
    async forcePopulate() {

        try {
            await cms.populateBoxes('boxes-container', 'box-template');
    
        } catch (error) {
            console.error('❌ Force populate failed:', error);
        }
    },
    
    // Включить тестовые данные
    enableMockData() {

        cms.useMockData = true;

    },
    
    // Отключить тестовые данные
    disableMockData() {

        cms.useMockData = false;

    },
    
    // Принудительное обновление с тестовыми данными
    async populateWithMockData() {

        this.enableMockData();
        await this.forcePopulate();
    },
    
    // Принудительное обновление фотографий на текущей странице
    async forceUpdatePhotos() {

        
        // Находим все элементы с фотографиями
        const photoElements = ['box-photo1', 'box-photo2', 'box-photo3'];
        
        photoElements.forEach(photoName => {
            const elements = document.querySelectorAll(`[data-framer-name="${photoName}"]`);
    
            
            elements.forEach((element, index) => {
        
                
                // Получаем текущий background-image URL
                const currentBg = element.style.backgroundImage;
                const match = currentBg.match(/url\(["']?(.+?)["']?\)/);
                
                if (match && match[1]) {
                    const imageUrl = match[1];
            
                    
                    // Принудительно обновляем ВСЕ изображения
                    const allImages = element.querySelectorAll('img');
                    allImages.forEach((img, imgIndex) => {
                        img.src = imageUrl;
                        img.srcset = ''; // Очищаем srcset для предотвращения конфликтов
                
                    });
                    
                    // Обновляем все wrapper элементы
                    const wrapperElements = element.querySelectorAll('[data-framer-background-image-wrapper="true"]');
                    wrapperElements.forEach((wrapper, wrapperIndex) => {
                        wrapper.style.backgroundImage = `url(${imageUrl})`;
                        wrapper.style.backgroundSize = 'cover';
                        wrapper.style.backgroundPosition = 'center center';
                
                    });
                }
            });
        });
        

    },
    
    // Полный перезапуск CMS
    async fullRestart() {

        cms.resetState();
        await cms.autoInit();

    },
    
    // Диагностика фотографий
    diagnosePhotos() {

        
        const photoElements = ['box-photo1', 'box-photo2', 'box-photo3'];
        
        photoElements.forEach(photoName => {
            const elements = document.querySelectorAll(`[data-framer-name="${photoName}"]`);
    
            
            elements.forEach((element, index) => {
        
        
                
                const allImages = element.querySelectorAll('img');
        
                allImages.forEach((img, imgIndex) => {
            
                });
                
                const wrappers = element.querySelectorAll('[data-framer-background-image-wrapper="true"]');
        
                wrappers.forEach((wrapper, wrapperIndex) => {
            
                });
            });
        });
        

    },
    
    // Проверка CORS
    async testCORS() {

        try {
            const response = await fetch('https://catering-marketplace.me/api/boxes.php', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const data = await response.json();
    
            return data;
        } catch (error) {
            console.error('❌ CORS Error:', error);
            return null;
        }
    },
    
    // Тестирование генерации slug'ов
    testSlugs() {

        const testNames = [
            'Италия Анипасто',
            'Вегетарианский сет',
            'Классический бокс',
            'Премиум набор'
        ];
        
        testNames.forEach(name => {
            const slug = cms.generateSlug(name);
    
    
        });
    },
    
    // Диагностика проблемы
    diagnose() {
        return cms.diagnoseIssue();
    },
    
    // Принудительное показывание
    forceShow() {
        return cms.forceShow();
    },
    
    // Обновить все фотографии
    async updatePhotos() {

        await cms.updateAllVisiblePhotos();

    },
    
    // Перезапустить систему мониторинга фотографий
    restartPhotoWatcher() {

        if (cms.photoObserver) {
            cms.photoObserver.disconnect();
        }
        cms.setupPhotoWatcher();

    },
    
    // Тестирование корзины
    testCart() {

        
        if (window.cartManager) {
    
            
            // Диагностика элементов
            window.cartManager.diagnoseCartElements();
            
            // Тестируем добавление товара
    
            const testBoxId = '688a581adfb71'; // Используем ID из лога
            
    
            window.cartManager.addItem(testBoxId, 1);
            
            setTimeout(() => {
        
        
                
                // Принудительно обновляем UI
        
                window.cartManager.updateUI();
                window.cartManager.updateCartButton();
            }, 1000);
            
        } else {
            console.error('❌ Cart manager not found');
        }
        

    },
    
    // Тестирование модального окна корзины
    testCartModal() {

        
        if (window.cartManager) {
    
            
            // Добавляем несколько товаров для тестирования
            window.cartManager.addItem('688a581adfb71', 2);
            window.cartManager.addItem('688a58740735a', 1);
            
    
            
            // Проверяем обновление модального окна
            setTimeout(() => {
                window.cartManager.updateCartModal();
        
            }, 500);
            
        } else {
            console.error('❌ Cart manager not found');
        }
        

    },
    
    // Очистить корзину для тестирования
    clearTestCart() {

        if (window.cartManager) {
            window.cartManager.clearCart();
    
        } else {
            console.error('❌ Cart manager not found');
        }
    },
    
    // Глобальная очистка корзины для использования в iframe
    clearCartGlobal() {

        if (window.cartManager) {
            window.cartManager.clearCart();
    
            return true;
        } else {
            console.error('❌ Cart manager not found');
            return false;
        }
    }
};

// Экспортируем для глобального использования