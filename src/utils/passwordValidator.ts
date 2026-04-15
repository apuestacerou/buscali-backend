/**
 * Utilidad para validación de contraseñas seguras.
 * Implementa reglas de seguridad fuerte con cálculo de fortaleza visual.
 */

export interface PasswordValidationResult {
  isValid: boolean;
  strength: number; // 1-5 escala de fortaleza
  errors: string[];
  suggestions: string[];
  score: {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Reglas mínimas para contraseña segura:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial (!@#$%^&*)
 */
const MIN_LENGTH = 8;
const SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;

/**
 * Valida que una contraseña cumpla con los requisitos de seguridad.
 * @param password - La contraseña a validar
 * @returns Objeto con resultado de validación y fortaleza
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Validaciones básicas
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      strength: 0,
      errors: ['La contraseña es obligatoria'],
      suggestions: [],
      score: {
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumbers: false,
        hasSpecialChar: false,
      },
    };
  }

  // Detectar espacios en blanco
  if (password.includes(' ')) {
    errors.push('La contraseña no debe contener espacios');
  }

  // Calcular score
  const score = {
    hasMinLength: password.length >= MIN_LENGTH,
    hasUpperCase: UPPERCASE_REGEX.test(password),
    hasLowerCase: LOWERCASE_REGEX.test(password),
    hasNumbers: NUMBER_REGEX.test(password),
    hasSpecialChar: SPECIAL_CHARS.test(password),
  };

  // Validar longitud mínima
  if (!score.hasMinLength) {
    errors.push(`La contraseña debe tener al menos ${MIN_LENGTH} caracteres (actual: ${password.length})`);
    suggestions.push(`Añade ${MIN_LENGTH - password.length} carácter(es) más`);
  }

  // Validar mayúsculas
  if (!score.hasUpperCase) {
    errors.push('Debe contener al menos una letra mayúscula (A-Z)');
    suggestions.push('Añade una mayúscula: ej. Contraseña');
  }

  // Validar minúsculas
  if (!score.hasLowerCase) {
    errors.push('Debe contener al menos una letra minúscula (a-z)');
    suggestions.push('Añade una minúscula mientras escribes');
  }

  // Validar números
  if (!score.hasNumbers) {
    errors.push('Debe contener al menos un número (0-9)');
    suggestions.push('Añade un número: ej. 2024');
  }

  // Validar caracteres especiales
  if (!score.hasSpecialChar) {
    errors.push('Debe contener al menos un carácter especial (!@#$%^&*)');
    suggestions.push('Añade un símbolo: ej. ! @ # $ %');
  }

  // Calcular fortaleza (1-5)
  const strength = calculateStrength(score, password.length);

  return {
    isValid: errors.length === 0,
    strength,
    errors,
    suggestions,
    score,
  };
}

/**
 * Calcula la fortaleza de una contraseña en escala 1-5
 * @param score - Objeto con cumplimiento de requisitos
 * @param length - Longitud de la contraseña
 * @returns Número del 1 al 5
 */
export function calculateStrength(
  score: {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
  },
  length: number
): number {
  let strength = 0;

  // Bonus por requisitos cumplidos
  if (score.hasMinLength) strength += 1;
  if (score.hasUpperCase) strength += 1;
  if (score.hasLowerCase) strength += 1;
  if (score.hasNumbers) strength += 1;
  if (score.hasSpecialChar) strength += 1;

  // Bonus extra por longitud muy larga
  if (length >= 16) strength += 1;
  if (length >= 20) strength += 1;

  // Capear máximo a 5
  return Math.min(strength, 5);
}

/**
 * Retorna información visual sobre la fortaleza
 * @param strength - Número del 1 al 5
 * @returns Objeto con color, label y descripción
 */
export function getStrengthInfo(strength: number): {
  color: string;
  label: string;
  description: string;
  percentage: number;
} {
  const strengthMap: Record<
    number,
    { color: string; label: string; description: string; percentage: number }
  > = {
    0: {
      color: '#999999',
      label: 'Sin contraseña',
      description: 'Ingresa una contraseña',
      percentage: 0,
    },
    1: {
      color: '#ff4444',
      label: 'Muy débil',
      description: 'Cumple muy pocos requisitos. Cambiar inmediatamente.',
      percentage: 20,
    },
    2: {
      color: '#ffaa00',
      label: 'Débil',
      description: 'Parcialmente segura. Considera mejorar.',
      percentage: 40,
    },
    3: {
      color: '#ffdd00',
      label: 'Regular',
      description: 'Aceptable pero podría ser más fuerte.',
      percentage: 60,
    },
    4: {
      color: '#88dd00',
      label: 'Fuerte',
      description: 'Buena seguridad. Cumple la mayoría de requisitos.',
      percentage: 80,
    },
    5: {
      color: '#00cc00',
      label: 'Muy fuerte',
      description: 'Excelente. Cumple todos los requisitos de seguridad.',
      percentage: 100,
    },
  };

  return strengthMap[strength] || strengthMap[0];
}

/**
 * Valida una contraseña y lanza error si no es válida
 * Usado para validaciones sincrónicas
 */
export function validatePasswordOrThrow(password: string): void {
  const result = validatePassword(password);
  if (!result.isValid) {
    throw new Error(result.errors.join('; '));
  }
}
