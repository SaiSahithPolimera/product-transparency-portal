export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  private errors: ValidationError[] = [];

  addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  getErrorMessages(): string[] {
    return this.errors.map(error => error.message);
  }
}

export const validateProductName = (name: any): string[] => {
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Product name is required');
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.push('Product name must be at least 2 characters long');
    }
    if (trimmedName.length > 100) {
      errors.push('Product name cannot exceed 100 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_.,()&]+$/.test(trimmedName)) {
      errors.push('Product name contains invalid characters (only letters, numbers, spaces, and basic punctuation allowed)');
    }
  }
  
  return errors;
};

export const validateCategory = (category: any): string[] => {
  const errors: string[] = [];
  const validCategories = ['food', 'non-food', 'electronics', 'clothing', 'cosmetics'];
  
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Product category is required');
  } else if (!validCategories.includes(category)) {
    errors.push(`Invalid product category. Must be one of: ${validCategories.join(', ')}`);
  }
  
  return errors;
};

export const validateCompanyName = (company: any): string[] => {
  const errors: string[] = [];
  
  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    errors.push('Company name is required');
  } else {
    const trimmedCompany = company.trim();
    if (trimmedCompany.length < 2) {
      errors.push('Company name must be at least 2 characters long');
    }
    if (trimmedCompany.length > 100) {
      errors.push('Company name cannot exceed 100 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_.,()&]+$/.test(trimmedCompany)) {
      errors.push('Company name contains invalid characters (only letters, numbers, spaces, and basic punctuation allowed)');
    }
  }
  
  return errors;
};

export const validateDescription = (description: any): string[] => {
  const errors: string[] = [];
  
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Product description must be a string');
    } else if (description.length > 1000) {
      errors.push('Product description cannot exceed 1000 characters');
    }
  }
  
  return errors;
};

export const validateAnswers = (answers: any): string[] => {
  const errors: string[] = [];
  
  if (answers !== undefined && answers !== null) {
    if (!Array.isArray(answers)) {
      errors.push('Answers must be an array');
    } else {
      answers.forEach((answer, index) => {
        if (!answer || typeof answer !== 'object') {
          errors.push(`Answer ${index + 1}: Must be an object`);
          return;
        }
        
        if (!answer.question_id || typeof answer.question_id !== 'number' || answer.question_id <= 0) {
          errors.push(`Answer ${index + 1}: Invalid question ID`);
        }
        
        if (!answer.value || typeof answer.value !== 'string' || answer.value.trim().length === 0) {
          errors.push(`Answer ${index + 1}: Answer value is required`);
        } else if (answer.value.length > 1000) {
          errors.push(`Answer ${index + 1}: Answer cannot exceed 1000 characters`);
        }
      });
    }
  }
  
  return errors;
};

export const validateProductSubmission = (data: any): ValidationResult => {
  const result = new ValidationResult();
  
  const nameErrors = validateProductName(data.name);
  nameErrors.forEach(error => result.addError('name', error));
  
  const categoryErrors = validateCategory(data.category);
  categoryErrors.forEach(error => result.addError('category', error));
  
  const companyErrors = validateCompanyName(data.company);
  companyErrors.forEach(error => result.addError('company', error));
  
  const descriptionErrors = validateDescription(data.description);
  descriptionErrors.forEach(error => result.addError('description', error));
  
  const answerErrors = validateAnswers(data.answers);
  answerErrors.forEach(error => result.addError('answers', error));
  
  return result;
};

export const validateEmail = (email: any): string[] => {
  const errors: string[] = [];
  
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    if (email.length > 255) {
      errors.push('Email cannot exceed 255 characters');
    }
  }
  
  return errors;
};

export const validatePassword = (password: any): string[] => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }
  }
  
  return errors;
};