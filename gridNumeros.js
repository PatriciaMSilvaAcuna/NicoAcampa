 document.addEventListener('DOMContentLoaded', () => {
        // Crear la grilla con números del 1 al 100
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

            saveButton.addEventListener('click', function () {
                const nombre = inputField.value.trim();
                if (nombre !== '') {
                    nombreGuardado.textContent = nombre;
                    nombreGuardado.style.display = 'block';
                    inputContainer.style.display = 'none';
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

            gridItem.addEventListener('mouseenter', function () {
                if (nombreGuardado.textContent.trim() === '') {
                    inputContainer.style.display = 'block';
                }
                pagoContainer.style.display = 'block';
            });

            gridItem.addEventListener('mouseleave', function () {
                inputContainer.style.display = 'none';
                pagoContainer.style.display = 'none';
            });

            document.getElementById('gridNumeros').appendChild(gridItem);
        }
    });