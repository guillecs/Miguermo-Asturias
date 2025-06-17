// Este evento se asegura de que el script se ejecute solo cuando todo el HTML ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Función auxiliar para convertir texto Markdown simple (negrita con **) a HTML.
     * Solo para uso interno y formatos muy básicos.
     */
    function formatMarkdownText(text) {
        // Reemplaza **texto** con <strong>texto</strong>
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    /**
     * -------------------------------------------
     * SECCIÓN 1: CARGA DE CONFIGURACIÓN Y ESTILOS
     * -------------------------------------------
     * Este bloque se encarga de leer el archivo 'config.json' para aplicar
     * el tema de colores y rellenar textos dinámicos en la página.
     */

    // Función para aplicar el tema de color desde config.json
    function applyTheme(config) {
        // Encuentra el tema definido como "defaultTheme" en el JSON
        const themeName = config.defaultTheme || 'Default';
        const selectedTheme = config.colorThemes.find(theme => theme.name === themeName);
        
        if (selectedTheme) {
            const root = document.documentElement; // El elemento raíz (<html>)
            // Asigna los colores del tema a las variables CSS
            root.style.setProperty('--primary-color', selectedTheme.primary);
            root.style.setProperty('--secondary-color', selectedTheme.secondary);
            root.style.setProperty('--accent-color', selectedTheme.accent);
            root.style.setProperty('--light-bg', selectedTheme.lightBg);
            root.style.setProperty('--white-bg', selectedTheme.whiteBg);
            root.style.setProperty('--dark-text', selectedTheme.darkText);
            root.style.setProperty('--light-text', selectedTheme.lightText);
            root.style.setProperty('--border-color', selectedTheme.borderColor);
        }
    }

    // Función para cargar contenido dinámico (textos, títulos) desde config.json
    function loadDynamicContent(config) {
        // --- Elementos comunes a todas las páginas ---
        document.title = config.siteTitle || document.title;
        // Usa querySelectorAll para seleccionar todos los elementos con el ID 'siteTitleDynamic'
        const siteTitleDynamicElements = document.querySelectorAll('#siteTitleDynamic'); 
        siteTitleDynamicElements.forEach(element => {
            if (element) element.textContent = config.siteTitle;
        });
        
        const footerTextDynamic = document.getElementById('footerTextDynamic');
        if (footerTextDynamic) footerTextDynamic.textContent = config.footerText;

        // --- Elementos específicos de la página de inicio (index.html) ---
        const heroTitleDynamic = document.getElementById('heroTitleDynamic');
        if (heroTitleDynamic) heroTitleDynamic.textContent = config.heroPage.title;
        
        const heroDescriptionDynamic = document.getElementById('heroDescriptionDynamic');
        if (heroDescriptionDynamic) heroDescriptionDynamic.textContent = config.heroPage.description;
        
        // La sección de contacto ha sido eliminada, por lo que este bloque ya no es necesario

        // --- Elementos específicos de la página de calendario (calendario.html) ---
        const calendarTitleDynamic = document.getElementById('calendarTitleDynamic');
        if(calendarTitleDynamic) calendarTitleDynamic.textContent = config.calendarPage.title;

        const calendarDescriptionDynamic = document.getElementById('calendarDescriptionDynamic');
        if(calendarDescriptionDynamic) calendarDescriptionDynamic.textContent = config.calendarPage.description;

        const googleCalendarEmbed = document.getElementById('googleCalendarEmbed');
        if(googleCalendarEmbed && config.calendarPage.googleCalendarEmbedUrl) {
            googleCalendarEmbed.src = config.calendarPage.googleCalendarEmbedUrl;
        } else if (googleCalendarEmbed) {
            console.warn('URL de Google Calendar no encontrada o vacía en config.json');
        }

        const bookingTitleDynamic = document.getElementById('bookingTitleDynamic');
        // Asegúrate de que bookingSection existe antes de acceder a sus propiedades
        if(bookingTitleDynamic && config.calendarPage && config.calendarPage.bookingSection) {
            bookingTitleDynamic.textContent = config.calendarPage.bookingSection.bookingTitle;
        }

        const bookingDescriptionDynamic = document.getElementById('bookingDescriptionDynamic');
        // Asegúrate de que bookingSection existe antes de acceder a sus propiedades
        if(bookingDescriptionDynamic && config.calendarPage && config.calendarPage.bookingSection) {
            bookingDescriptionDynamic.textContent = config.calendarPage.bookingSection.bookingDescription;
        }
        
        const bookingFormLink = document.getElementById('bookingFormLink');
        if(bookingFormLink && config.calendarPage.googleFormLink) {
            bookingFormLink.href = config.calendarPage.googleFormLink;
            bookingFormLink.textContent = "Abrir Formulario de Reserva";
        } else if (bookingFormLink) {
            console.warn('Enlace del formulario de reserva no encontrado o vacío en config.json');
        }

        // --- Elementos específicos de la página de información (informacion.html) ---
        const infoTitleDynamic = document.getElementById('infoTitleDynamic');
        if (infoTitleDynamic && config.informationPage) infoTitleDynamic.textContent = config.informationPage.title;

        const infoDescriptionDynamic = document.getElementById('infoDescriptionDynamic');
        if (infoDescriptionDynamic && config.informationPage) infoDescriptionDynamic.textContent = config.informationPage.description;

        const rulesContentDynamic = document.getElementById('rulesContentDynamic');
        if (rulesContentDynamic && config.informationPage && config.informationPage.rules) {
            // Unir los elementos de la lista con un salto de línea si se desean párrafos separados,
            // o usar map para crear elementos <li> para una lista HTML
            rulesContentDynamic.innerHTML = config.informationPage.rules.map(rule => `<li>${formatMarkdownText(rule)}</li>`).join('');
        }

        const servicesContentDynamic = document.getElementById('servicesContentDynamic');
        if (servicesContentDynamic && config.informationPage && config.informationPage.services) {
            // Aplica formatMarkdownText a cada servicio antes de crear el li
            servicesContentDynamic.innerHTML = config.informationPage.services.map(service => `<li>${formatMarkdownText(service)}</li>`).join('');
        }

        const amenitiesContentDynamic = document.getElementById('amenitiesContentDynamic');
        if (amenitiesContentDynamic && config.informationPage && config.informationPage.amenities) {
            // Aplica formatMarkdownText a cada comodidad antes de crear el li
            amenitiesContentDynamic.innerHTML = config.informationPage.amenities.map(amenity => `<li>${formatMarkdownText(amenity)}</li>`).join('');
        }

        // Nuevos elementos para la sección de ubicación
        const locationTitleDynamic = document.getElementById('locationTitleDynamic');
        if (locationTitleDynamic && config.informationPage && config.informationPage.locationInfo) {
            locationTitleDynamic.textContent = config.informationPage.locationInfo.title;
        }

        const locationDescriptionDynamic = document.getElementById('locationDescriptionDynamic');
        if (locationDescriptionDynamic && config.informationPage && config.informationPage.locationInfo) {
            locationDescriptionDynamic.textContent = config.informationPage.locationInfo.description;
        }

        const locationAddressDynamic = document.getElementById('locationAddressDynamic');
        if (locationAddressDynamic && config.informationPage && config.informationPage.locationInfo) {
            locationAddressDynamic.textContent = config.informationPage.locationInfo.address;
        }

        // Cargar el mapa de Google Maps
        const googleMapsEmbed = document.getElementById('googleMapsEmbed');
        if (googleMapsEmbed && config.informationPage && config.informationPage.locationInfo && config.informationPage.locationInfo.googleMapsEmbedUrl) {
            googleMapsEmbed.src = config.informationPage.locationInfo.googleMapsEmbedUrl;
        } else if (googleMapsEmbed) {
            console.warn('URL de Google Maps no encontrada o vacía en config.json para locationInfo.');
        }


        const gettingThereDynamic = document.getElementById('gettingThereDynamic');
        if (gettingThereDynamic && config.informationPage && config.informationPage.locationInfo && config.informationPage.locationInfo.gettingThere) {
            // Aplica formatMarkdownText a cada elemento antes de crear el li
            gettingThereDynamic.innerHTML = config.informationPage.locationInfo.gettingThere.map(item => `<li>${formatMarkdownText(item)}</li>`).join('');
        }

        const nearbyAttractionsDynamic = document.getElementById('nearbyAttractionsDynamic');
        if (nearbyAttractionsDynamic && config.informationPage && config.informationPage.locationInfo && config.informationPage.locationInfo.nearbyAttractions) {
            // Aplica formatMarkdownText a cada elemento antes de crear el li
            nearbyAttractionsDynamic.innerHTML = config.informationPage.locationInfo.nearbyAttractions.map(item => `<li>${formatMarkdownText(item)}</li>`).join('');
        }

        // --- Elementos específicos de la página de checklist (checklist.html) ---
        const checklistTitleDynamic = document.getElementById('checklistTitleDynamic');
        if (checklistTitleDynamic && config.checklistPage) checklistTitleDynamic.textContent = config.checklistPage.title;

        const checklistDescriptionDynamic = document.getElementById('checklistDescriptionDynamic');
        if (checklistDescriptionDynamic && config.checklistPage) checklistDescriptionDynamic.textContent = config.checklistPage.description;

        const arrivalDescriptionDynamic = document.getElementById('arrivalDescriptionDynamic');
        if (arrivalDescriptionDynamic && config.checklistPage && config.checklistPage.arrivalForm) {
            arrivalDescriptionDynamic.textContent = config.checklistPage.arrivalForm.description;
        }
        const arrivalFormLink = document.getElementById('arrivalFormLink');
        if (arrivalFormLink && config.checklistPage && config.checklistPage.arrivalForm) {
            arrivalFormLink.href = config.checklistPage.arrivalForm.link;
        }

        const departureDescriptionDynamic = document.getElementById('departureDescriptionDynamic');
        if (departureDescriptionDynamic && config.checklistPage && config.checklistPage.departureForm) {
            departureDescriptionDynamic.textContent = config.checklistPage.departureForm.description;
        }
        const departureFormLink = document.getElementById('departureFormLink');
        if (departureFormLink && config.checklistPage && config.checklistPage.departureForm) {
            departureFormLink.href = config.checklistPage.departureForm.link;
        }
    }

    // Petición para obtener y procesar el archivo config.json
    fetch('data/config.json') // La ruta debe ser correcta, asumiendo 'data/'
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar config.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(config => {
            applyTheme(config);
            loadDynamicContent(config);

            /**
             * -----------------------------------------
             * SECCIÓN 2: LÓGICA DEL POP-UP DE CONTRASEÑA
             * -----------------------------------------
             * Este bloque solo se ejecuta en la página que contenga el pop-up (index.html).
             */

            // IMPORTANTE: La contraseña está aquí por motivos de funcionalidad.
            // NO ES SEGURO para un entorno de producción. Cualquier usuario puede verla.
            // Para una seguridad adecuada, se recomienda implementar un sistema de autenticación en el servidor.
            const CORRECT_PASSWORD = '1234'; // Contraseña hardcodeada (NO SEGURA para producción)

            const passwordOverlay = document.getElementById('password-overlay');
            const passwordInput = document.getElementById('password-input');
            const passwordSubmit = document.getElementById('password-submit');
            const passwordError = document.getElementById('password-error');

            // Comprueba si el elemento del pop-up existe en la página actual (solo index.html)
            if (passwordOverlay) {
                // Paso 1: Comprobar si la contraseña ya fue introducida correctamente en esta sesión
                if (sessionStorage.getItem('passwordCorrect') === 'true') {
                    // Si ya es correcta, ocultar el overlay inmediatamente
                    passwordOverlay.classList.add('d-none');
                    passwordOverlay.classList.remove('d-flex');
                    return; // Salir de la función para no mostrar el modal
                }

                // Si no es correcta, mostrar el modal de contraseña
                passwordOverlay.classList.remove('d-none');
                passwordOverlay.classList.add('d-flex');
                passwordOverlay.style.opacity = '1';

                passwordInput.focus(); // Pone el cursor en el campo de contraseña.

                // Función para verificar la contraseña introducida.
                const checkPassword = () => {
                    if (passwordInput.value === CORRECT_PASSWORD) {
                        // Contraseña correcta: guardar en sessionStorage
                        sessionStorage.setItem('passwordCorrect', 'true');

                        // Ocultar el pop-up con una transición.
                        passwordOverlay.style.opacity = '0'; // Inicia la transición de opacidad a 0
                        setTimeout(() => {
                            passwordOverlay.classList.remove('d-flex');
                            passwordOverlay.classList.add('d-none');
                            passwordOverlay.style.opacity = '1'; // Restablece la opacidad para futuras visualizaciones
                        }, 300); // Espera a que termine la transición de opacidad (debe coincidir con la duración de CSS)
                    } else {
                        // Contraseña incorrecta: muestra un mensaje de error.
                        passwordError.textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
                        passwordError.classList.remove('d-none'); // Muestra el mensaje de error
                        passwordInput.value = ''; // Limpia el campo.
                        passwordInput.focus(); // Vuelve a poner el cursor en el campo.
                    }
                };

                // Asigna la función checkPassword al evento 'click' del botón.
                passwordSubmit.addEventListener('click', checkPassword);

                // Permite enviar la contraseña pulsando la tecla "Enter".
                passwordInput.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault(); // Evita que el formulario se envíe (comportamiento por defecto)
                        checkPassword();
                    }
                });
            }
        })
        .catch(error => {
            console.error('No se pudo cargar la configuración:', error);
            // Podrías mostrar un mensaje al usuario aquí si la configuración es crucial
        });
});
