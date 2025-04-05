export interface PasswordStrength {
    score: number;
    feedback: string;
  }
  
  export function checkPasswordStrength(password: string): PasswordStrength {
    let score = 0;
    let feedback = "";
  
    if (password.length === 0) {
      return { score: 0, feedback: "" };
    }
  
    if (password.length >= 5) {
      score += 1;
    } else {
      feedback = "Senha deve ter pelo menos 5 caracteres";
      return { score, feedback };
    }
  
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback = "Adicione pelo menos um número";
      return { score, feedback };
    }
  
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback = "Adicione pelo menos uma letra minúscula";
      return { score, feedback };
    }
  
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback = "Adicione pelo menos uma letra maiúscula";
      return { score, feedback };
    }
  
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback = "Adicione pelo menos um caractere especial";
      return { score, feedback };
    }
  
    if (score === 5) {
      feedback = "Senha forte";
    } else if (score >= 3) {
      feedback = "Senha média";
    } else {
      feedback = "Senha fraca";
    }
  
    return { score, feedback };
  }
  
  export function getPasswordStrengthColor(score: number, passwordLength: number): string {
    if (passwordLength === 0) return "bg-gray-200";
    
    switch (score) {
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-blue-500";
      case 5: return "bg-green-500";
      default: return "bg-red-500";
    }
  }