document.addEventListener('DOMContentLoaded', () => {
    // Función para generar la grilla de números del 1 al 100 con estado inicial
    function generarGrilla() {
        const gridContainer = document.getElementById('gridNumeros');

        for (let i = 1; i <= 100; i++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.setAttribute('data-numero', i);

            const numeroDiv = document.createElement('div');
            numeroDiv.classList.add('numero');
            numeroDiv.textContent = i;

            gridItem.appendChild(numeroDiv);

            const nombreGuardado = document.createElement('div');
            nombreGuardado.classList.add('nombre-guardado');
            gridItem.appendChild(nombreGuardado);

            const inputContainer = document.createElement('div');
            inputContainer.classList.add('input-container');

            const inputField = document.createElement('input');
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('placeholder', 'Nombre del comprador');

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Guardar';

            inputContainer.appendChild(inputField);
            inputContainer.appendChild(saveButton);
            gridItem.appendChild(inputContainer);

            const pagoContainer = document.createElement('div');
            pagoContainer.classList.add('pago-container');

            const pagoCheckbox = document.createElement('input');
            pagoCheckbox.setAttribute('type', 'checkbox');
            pagoCheckbox.setAttribute('title', 'Marcar como pagado');

            pagoContainer.appendChild(pagoCheckbox);
            pagoContainer.appendChild(document.createTextNode('Pagó'));
            gridItem.appendChild(pagoContainer);

            // Recuperar los datos almacenados
            const storedData = JSON.parse(localStorage.getItem('sorteoData')) || {};
            const itemData = storedData[i] || {};

            if (itemData.nombre) {
                nombreGuardado.textContent = itemData.nombre;
                nombreGuardado.style.display = 'block';
                gridItem.classList.add('assigned');
            }
            if (itemData.pagado) {
                pagoCheckbox.checked = true;
                gridItem.classList.add('paid');
            }

            // Mostrar el campo de edición al hacer clic en el número
            numeroDiv.addEventListener('click', function () {
                inputContainer.classList.add('editing');
                inputField.focus();
            });

            saveButton.addEventListener('click', function () {
                const nombre = inputField.value.trim();
                if (nombre !== '') {
                    nombreGuardado.textContent = nombre;
                    nombreGuardado.style.display = 'block';
                    inputContainer.classList.remove('editing');
                    gridItem.classList.add('assigned');

                    // Guardar en localStorage
                    const updatedData = JSON.parse(localStorage.getItem('sorteoData')) || {};
                    updatedData[i] = { nombre: nombre, pagado: pagoCheckbox.checked };
                    localStorage.setItem('sorteoData', JSON.stringify(updatedData));
                }
            });

            pagoCheckbox.addEventListener('change', function () {
                if (pagoCheckbox.checked) {
                    gridItem.classList.remove('assigned');
                    gridItem.classList.add('paid');
                } else {
                    gridItem.classList.remove('paid');
                    if (nombreGuardado.textContent.trim() !== '') {
                        gridItem.classList.add('assigned');
                    }
                }

                // Actualizar en localStorage
                const updatedData = JSON.parse(localStorage.getItem('sorteoData')) || {};
                updatedData[i] = { nombre: nombreGuardado.textContent.trim(), pagado: pagoCheckbox.checked };
                localStorage.setItem('sorteoData', JSON.stringify(updatedData));
            });

            gridContainer.appendChild(gridItem);
        }
    }

    // Función para calcular las estadísticas de la grilla
    function calcularEstadisticas() {
        const estadisticas = {
            total_vendidos: 0,
            cantidad_adeudados: 0,
            numeros_sin_vender: 0
        };

        const celdas = document.querySelectorAll('#gridNumeros .grid-item');
        celdas.forEach(celda => {
            if (celda.classList.contains('paid')) {
                estadisticas.total_vendidos++;
            } else if (celda.classList.contains('assigned')) {
                estadisticas.cantidad_adeudados++;
            } else if (!celda.classList.contains('paid') && !celda.classList.contains('assigned')) {
                estadisticas.numeros_sin_vender++;
            }
        });

        return estadisticas;
    }

    // Función para mostrar las estadísticas en el footer
    function mostrarEstadisticas() {
        const estadisticas = calcularEstadisticas();
        const estadisticasDiv = document.getElementById('estadisticas');
        
        estadisticasDiv.innerHTML = `
            <p>Total números vendidos: ${estadisticas.total_vendidos}</p>
            <p>Cantidad números adeudados: ${estadisticas.cantidad_adeudados}</p>
            <p>Números sin vender: ${estadisticas.numeros_sin_vender}</p>
        `;
    }

    // Inicializar la grilla y mostrar estadísticas
    generarGrilla();
    mostrarEstadisticas();
});
