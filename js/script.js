// Este evento se asegura de que el script se ejecute solo cuando todo el HTML ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

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
        
        const contactDetailsContent = document.getElementById('contactDetailsContent');
        if (contactDetailsContent) {
            // Asegúrate de que contactPage existe antes de acceder a sus propiedades
            if (config.contactPage) {
                contactDetailsContent.innerHTML = `
                    <p><strong>Email:</strong> ${config.contactPage.email}</p>
                    <p><strong>Teléfono:</strong> ${config.contactPage.phone}</p>
                    <p><strong>Dirección:</strong> ${config.contactPage.address}</p>
                    <p><strong>Horario:</strong> ${config.contactPage.hours}</p>
                `;
            } else {
                console.warn('La sección contactPage no está definida en config.json');
            }
        }

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

        // --- Generación de enlaces sociales (si existen en config.json y el elemento socialLinksDynamic) ---
        const socialLinksDynamic = document.getElementById('socialLinksDynamic');
        if (socialLinksDynamic && config.socialLinks && config.socialLinks.length > 0) {
            socialLinksDynamic.innerHTML = ''; // Limpiar cualquier contenido previo
            config.socialLinks.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                // Utiliza el icono de FontAwesome directamente si la clase está disponible
                a.innerHTML = `<i class="${link.iconClass}"></i> ${link.name}`; 
                socialLinksDynamic.appendChild(a);
            });
            // Opcional: Cargar FontAwesome si no está ya enlazado en el HTML
            // Este enlace ya está en calendario.html, pero se deja por si se usa en otras páginas sin él
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const faLink = document.createElement('link');
                faLink.rel = 'stylesheet';
                faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
                document.head.appendChild(faLink);
            }
        }
    }

    // Petición para obtener y procesar el archivo config.json
    fetch('data/config.json') // CAMBIADO: La ruta ahora es 'data/config.json'
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

            // IMPORTANTE: Se ha movido la contraseña del config.json a aquí por motivos de seguridad.
            // AÚN ASÍ, almacenar la contraseña directamente en el código JavaScript del lado del cliente
            // NO ES SEGURO para un entorno de producción. Cualquier usuario puede verla.
            // Para una seguridad adecuada, se recomienda implementar un sistema de autenticación en el servidor.
            const CORRECT_PASSWORD = '1234'; // Contraseña hardcodeada (NO SEGURA para producción)

            const passwordOverlay = document.getElementById('password-overlay');
            const passwordInput = document.getElementById('password-input');
            const passwordSubmit = document.getElementById('password-submit');
            const passwordError = document.getElementById('password-error');

            // Comprueba si el elemento del pop-up existe en la página actual.
            if (passwordOverlay) {
                // Si existe, lo muestra.
                passwordOverlay.classList.add('is-active');
                passwordInput.focus(); // Pone el cursor en el campo de contraseña.

                // Función para verificar la contraseña introducida.
                const checkPassword = () => {
                    if (passwordInput.value === CORRECT_PASSWORD) {
                        // Contraseña correcta: oculta el pop-up con una transición.
                        passwordOverlay.style.opacity = '0';
                        setTimeout(() => {
                            passwordOverlay.classList.remove('is-active');
                            passwordOverlay.style.display = 'none';
                        }, 300); // Espera a que termine la transición de opacidad
                    } else {
                        // Contraseña incorrecta: muestra un mensaje de error.
                        passwordError.textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
                        passwordError.style.display = 'block';
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
