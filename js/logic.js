document.getElementById('txtApellido').addEventListener('keypress', (event) => {
    if (!(/[a-zA-Z\s]/.test(event.key))) {
        event.preventDefault();
    }
});

document.getElementById('txtNombre').addEventListener('keypress', (event) => {
    if (!(/[a-zA-Z\s]/.test(event.key))) {
        event.preventDefault();
    }
});

document.getElementById('txtSalario').addEventListener('keypress', (event) => {
    if (!(/[0-9]/.test(event.key))) {
        event.preventDefault();
    }
});

document.getElementById('txtIdEmpleado').addEventListener('keypress', (event) => {
    if (!(/[0-9]/.test(event.key))) {
        event.preventDefault();
    }
});

let departmentData = [];
let townData = [];

fetch('./Json/departments.json')
    .then(response => response.json())
    .then(data => {
        departmentData = data;
        const departamentoSelect = document.getElementById('filterDepartament');
        for (const department of departmentData) {
            const option = document.createElement('option');
            option.value = department.code;
            option.textContent = department.name;
            departamentoSelect.appendChild(option);
        }
    })
    .catch(error => console.error('Error cargando datos de departamentos:', error));

document.getElementById('filterDepartament').addEventListener('change', () => {
    const selectedDepartmentCode = document.getElementById('filterDepartament').value;
    const filteredTowns = townData.filter(town => town.department === selectedDepartmentCode);
    const municipioSelect = document.getElementById('filterMunicipio');
    municipioSelect.innerHTML = '';
    for (const town of filteredTowns) {
        const option = document.createElement('option');
        option.value = town.code;
        option.textContent = town.name;
        municipioSelect.appendChild(option);
    }
});

fetch('./Json/towns.json')
    .then(response => response.json())
    .then(data => {
        townData = data;
    })
    .catch(error => console.error('Error cargando datos de municipios:', error));

let employees = [];
let employeeIdCounter = 1;

function agregarEmpleado() {
    const apellido = document.getElementById('txtApellido').value;
    const nombre = document.getElementById('txtNombre').value;
    const ciudadSelect = document.getElementById('filterMunicipio');
    const ciudad = ciudadSelect.options[ciudadSelect.selectedIndex].textContent;
    const fechaNacimiento = document.getElementById('txtFechaNacimiento').value;
    const salario = document.getElementById('txtSalario').value;
    const partesFecha = fechaNacimiento.split('-');
    const añoNacimiento = parseInt(partesFecha[0]);
    const mesNacimiento = parseInt(partesFecha[1]) - 1;
    const diaNacimiento = parseInt(partesFecha[2]);
    const hoy = new Date();
    const fechaNacimientoDate = new Date(añoNacimiento, mesNacimiento, diaNacimiento);
    const edadMilisegundos = hoy - fechaNacimientoDate;
    const edadDate = new Date(edadMilisegundos);
    const edad = Math.abs(edadDate.getUTCFullYear() - 1970);
    const nuevoId = employeeIdCounter++;
    const empleado = {
        id: nuevoId,
        apellidos: apellido + ' ' + nombre,
        ciudad: ciudad,
        edad: edad,
        salario: salario
    };
    employees.push(empleado);
    const table = document.getElementById('table');
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${nuevoId}</td>
        <td>${apellido} ${nombre}</td>
        <td>${ciudad}</td>
        <td>${edad}</td>
    `;
    document.getElementById('txtApellido').value = '';
    document.getElementById('txtNombre').value = '';
    document.getElementById('filterMunicipio').selectedIndex = 0;
    document.getElementById('txtFechaNacimiento').value = '';
    document.getElementById('txtSalario').value = '';
}

function buscarEmpleadoPorId(id) {
    return employees.find(empleado => empleado.id === id);
}

function mostrarMensajeError() {
    alert('No se encontró ningún empleado con el ID proporcionado.');
}

function mostrarDetallesEmpleado(empleado) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.innerHTML = `
        <h2>Detalles del Empleado</h2>
        <p>ID: ${empleado.id}</p>
        <p>Apellidos y Nombres: ${empleado.apellidos}</p>
        <p>Ciudad: ${empleado.ciudad}</p>
        <p>Edad: ${empleado.edad}</p>
        <p>Salario: ${empleado.salario}</p>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

document.getElementById('btnEnviar').addEventListener('click', agregarEmpleado);
document.getElementById('btnConsult').addEventListener('click', () => {
    const idEmpleado = parseInt(document.getElementById('txtIdEmpleado').value);
    const empleadoEncontrado = buscarEmpleadoPorId(idEmpleado);
    if (empleadoEncontrado) {
        mostrarDetallesEmpleado(empleadoEncontrado);
    } else {
    mostrarMensajeError();
}
});
