# Validation Inputs JS
## Objetivo

`Validation Inputs JS` es un script diseñado para ayudar a validar una gran cantidad de inputs HTML5. Está orientado a valores simples con una capa de personalización mínima. Todo el script esta inspirado en el sistema de validación de Codeigniter 4 [Ver más](https://codeigniter4.github.io/CodeIgniter4/libraries/validation.html) 

## Creación de las Reglas

Para ejecutar este validador, primero debes definir las reglas necesarias. Las reglas se componen de dos secciones:
<img width="861" alt="image" src="https://github.com/user-attachments/assets/839c208f-49fc-435a-a9a3-c3acaaa17890">

- **[inp_id_1]**: Id del elemento en el DOM, tanto `<input>` como `<select>`.
- **label**: sirve para nombrar el elemento en la lista de errores en caso de que no sea válido.
- **rules**: listado de las reglas que debe cumplir el elemento. El carácter "|" es el separador de las reglas.




#### Reglas de Validación

| Regla             | Descripción                                               | Ejemplo                      |
|-------------------|-----------------------------------------------------------|------------------------------|
| `permit_empty`    | Permite que el valor sea "empty()"                        | `permit_empty`               |
| `required`        | El valor no debe ser "empty()"                             | `required`                   |
| `required_if`     | Obligatorio si el objetivo no es "empty()"                 | `required_if[input_objective_1]` |
| `required_if_not` | Obligatorio si el objetivo es "empty()"                    | `required_if_not[input_objective_1]` |

#### Reglas Adicionales

| Regla          | Descripción                                                | Aplicación                         |
|----------------|------------------------------------------------------------|------------------------------------|
| `email`        | Error si el valor no tiene una estructura de email         | `email`                            |
| `numeric`      | Error si el valor no es numérico                           | `numeric`                          |
| `in_list`      | Error si el valor no está en la lista                      | `in_list[option_1,option_2,…]`     |
| `not_in_list`  | Error si el valor está en la lista                         | `not_in_list[option_1,option_2,…]` |
| `unchecked`    | Error si el valor está seleccionado                        | `unchecked`                        |
| `less_than`    | Error si el valor es igual o mayor que el deseado          | `less_than[100]`                   |
| `greater_than` | Error si el valor es igual o menor que el deseado          | `greater_than[50]`                 |
| `equal_than`   | Error si el valor es diferente al deseado                  | `equal_than[50]`                   |
| `min_length`   | Error si el valor contiene menos caracteres que el deseado | `min_length[150]`                  |
| `max_length`   | Error si el valor contiene más caracteres que el deseado   | `max_length[200]`                  |
| `length`       | Error si el valor no contiene los caracteres deseados      | `length[10]`                       |
| `date`         | Error si el valor no es una fecha válida o no es una fecha | `date`                             |

## Ejecución de Validación

Para ejecutar la validación, debes llamar a la función `validateRun(rules)` y pasarle las normas mencionadas anteriormente.

### Función de Retorno

Esta función devuelve un objeto con los siguientes parámetros:

- **`valid`**: Booleano que indica si la validación es correcta o no.
- **`msg`**: Cadena de texto en **formato lista HTML (`<ul><li>label -> error<li></ul>`)** con todos los errores. (Solo si `valid` === false) 

Cada input que no pase la validación recibirá la clase `is-invalid`, la cual se elimina en cada validación. 
*Se puede personalizar con el segundo parámetro al llamar a validateRun()*, ya que si no tienes *Bootstrap* en tu proyecto esta clase no hará nada.

## Ejemplo de Uso

```javascript
const rules = {
    ["inp_username"]: {label: "Username", rules: "required|min_length[5]"},
    ["inp_email"]: {label: "Email", rules: "required|email"},
    ["inp_age"]: {label: "Age", rules: "required|numeric"}
};

const result = validateRun(rules);

if (!result.valid) {
    console.log(result.msg); // Muestra la lista de errores
}
