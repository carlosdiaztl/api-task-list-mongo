

/**
 * Valida un campo de texto requerido, opcionalmente con una longitud mínima.
 * Lanza un error si la validación falla.
 * @param value El valor del campo a validar.
 * @param fieldName El nombre del campo (para mensajes de error).
 * @param minLength La longitud mínima requerida (por defecto 1).
 * @returns El valor del campo limpio (trim).
 */
export function validateRequiredString(value: string | undefined | null, fieldName: string, minLength: number = 1): string {
    if (value === undefined || value === null || typeof value !== 'string' || value.trim().length < minLength) {
        throw new Error(`${fieldName} is required and must be at least ${minLength} characters long.`);
    }
    return value.trim(); // Devuelve el valor limpio para usarlo consistentemente
}

/**
 * Valida un campo que debe ser uno de los valores de un enum.
 * Lanza un error si la validación falla.
 * @param value El valor del campo a validar.
 * @param fieldName El nombre del campo.
 * @param enumObject El objeto Enum (ej. TaskStatus, TaskPriority).
 * @returns El valor del enum validado.
 */
export function validateRequiredEnum<T extends Record<string, string>>(
    value: string | undefined | null,
    fieldName: string,
    enumObject: T // Un objeto que representa un enum (ej. { A: 'A', B: 'B' })
): T[keyof T] {
    if (value === undefined || value === null || typeof value !== 'string') {
        throw new Error(`${fieldName} is required.`);
    }
    const enumValues = Object.values(enumObject) as string[];
    if (!enumValues.includes(value)) {
        throw new Error(`${fieldName} must be one of: ${enumValues.join(', ')}.`);
    }
    return value as T[keyof T]; // Asegura el tipo de retorno correcto
}

/**
 * Valida una fecha requerida, asegurando que sea una fecha válida y no esté en el pasado.
 * Lanza un error si la validación falla.
 * @param value La fecha a validar.
 * @param fieldName El nombre del campo.
 * @returns El objeto Date validado.
 */
export function validateFutureDate(value: Date | string | undefined | null, fieldName: string): Date {
    if (value === undefined || value === null) {
        throw new Error(`${fieldName} is required.`);
    }
    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) { // Comprueba si la fecha es "Invalid Date"
        throw new Error(`${fieldName} is not a valid date.`);
    }

    // Para comparar solo fechas (sin horas/minutos/segundos), pon la hora de hoy a 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
        throw new Error(`${fieldName} cannot be in the past.`);
    }
    return date;
}

/**
 * Procesa un array de tags, eliminando duplicados, espacios en blanco y tags vacíos.
 * @param tags El array de tags a procesar.
 * @returns Un nuevo array con tags únicos y limpios.
 */
export function processUniqueTags(tags: string[] | undefined | null): string[] {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return [];
    }
    // Recorta espacios, filtra vacíos y asegura unicidad
    return [...new Set(tags.map(tag => tag.trim()).filter(tag => tag.length > 0))];
}

// src/api/v1/shared/utils/genericValidator.ts

/**
 * Valida un objeto de datos contra una lista de campos requeridos (notNullKeys).
 * Asegura que los campos en notNullKeys no sean null, undefined o cadenas vacías.
 * También permite omitir ciertas claves de esta validación básica.
 * Lanza un Error si algún campo requerido falla la validación.
 *
 * @param data El objeto de datos a validar (ej. Partial<Templates>, Partial<ITask>).
 * @param notNullKeys Un array de strings con los nombres de las claves que no deben ser nulas/vacías.
 * @param omitKeys Un array de strings con los nombres de las claves a ignorar durante la validación de notNullKeys.
 */
export function validateFields<T extends Record<string, any>>(
    data: Partial<T>,
    notNullKeys: string[],
    omitKeys: string[] = [] // Por defecto, ningún campo se omite
): void {
    if (!data || typeof data !== 'object') {
        throw new Error('Data to validate must be a non-null object.');
    }

    for (const key of notNullKeys) {
        // Si la clave está en la lista de omitir, la saltamos.
        if (omitKeys.includes(key)) {
            continue;
        }

        const value = data[key];

        // Comprobación básica: null, undefined, o cadena de texto vacía
        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
            throw new Error(`Field '${key}' is required and cannot be empty.`);
        }
        // Puedes añadir más comprobaciones genéricas aquí si es necesario,
        // por ejemplo, si un array no debe ser vacío.
        // if (Array.isArray(value) && value.length === 0) {
        //     throw new Error(`Field '${key}' cannot be an empty array.`);
        // }
    }
}