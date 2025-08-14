const form = document.getElementById('registrationForm');
const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    mobile: document.getElementById('mobile'),
    company: document.getElementById('company'),
    jobtitle: document.getElementById('jobtitle'),
    country: document.getElementById('country'),
    contact: document.getElementById('contact'),
    utm_source: document.getElementById('utm_source')
};

// Автоматичне заповнення прихованих полів
function setHiddenFields() {
    // Отримуємо UTM параметри з URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    
    if (utmSource) {
        inputs.utm_source.value = utmSource;
    }

    console.log("utm_source = "+utmSource);
    console.log(inputs.utm_source.value);


    const contactParam = urlParams.get('contact');

    
    if (contactParam) {
        inputs.contact.value = contactParam;
    }

    console.log("contact = "+contactParam);
    console.log(inputs.contact.value);
    
    // Можна додати логіку для поля contact (наприклад, з localStorage або cookies)
    // inputs.contact.value = localStorage.getItem('contact') || '';
}

// Ініціалізація прихованих полів при завантаженні сторінки
document.addEventListener('DOMContentLoaded', setHiddenFields);
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валідація мобільного телефону +38 (0xx) xxx-xx-xx
function validatePhone(phone) {
    const phoneRegex = /^\(0\d{2}\)\s\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
}

// Форматування номера телефону
function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    if (numbers.length <= 8) return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 8)}-${numbers.slice(8, 10)}`;
}

// Показати помилку
function showError(fieldName, message) {
    const input = inputs[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    const successElement = document.getElementById(`${fieldName}Success`);
    
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.style.display = 'block';
    if (successElement) successElement.style.display = 'none';
    if (message) errorElement.textContent = message;
}

// Показати успіх
function showSuccess(fieldName) {
    const input = inputs[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    const successElement = document.getElementById(`${fieldName}Success`);
    
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'block';
}

// Очистити валідацію
function clearValidation(fieldName) {
    const input = inputs[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    const successElement = document.getElementById(`${fieldName}Success`);
    
    input.classList.remove('error', 'success');
    errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'none';
}

// Валідація полів в реальному часі
inputs.name.addEventListener('input', function() {
    if (this.value.trim().length === 0) {
        clearValidation('name');
    } else if (this.value.trim().length < 2) {
        showError('name', 'Ім\'я повинно містити мінімум 2 символи');
    } else {
        showSuccess('name');
    }
});

inputs.email.addEventListener('input', function() {
    if (this.value.trim().length === 0) {
        clearValidation('email');
    } else if (!validateEmail(this.value)) {
        showError('email');
    } else {
        showSuccess('email');
    }
});

inputs.mobile.addEventListener('input', function() {
    let value = this.value;
    
    // Видаляємо всі нецифрові символи для обробки
    const numbersOnly = value.replace(/\D/g, '');
    
    // Перевіряємо, чи починається з 0
    if (numbersOnly.length > 0 && numbersOnly[0] !== '0') {
        showError('mobile', 'Номер повинен починатися з 0');
        return;
    }
    
    // Форматуємо номер
    const formatted = formatPhone(value);
    this.value = formatted;
    
    if (formatted.length === 0) {
        clearValidation('mobile');
    } else if (!validatePhone(formatted)) {
        showError('mobile');
    } else {
        showSuccess('mobile');
    }
});

inputs.company.addEventListener('input', function() {
    if (this.value.trim().length === 0) {
        clearValidation('company');
    } else if (this.value.trim().length < 2) {
        showError('company', 'Назва компанії повинна містити мінімум 2 символи');
    } else {
        showSuccess('company');
    }
});

inputs.jobtitle.addEventListener('input', function() {
    if (this.value.trim().length === 0) {
        clearValidation('jobtitle');
    } else if (this.value.trim().length < 2) {
        showError('jobtitle', 'Посада повинна містити мінімум 2 символи');
    } else {
        showSuccess('jobtitle');
    }
});

inputs.country.addEventListener('change', function() {
    if (this.value === '') {
        showError('country');
    } else {
        showSuccess('country');
    }
});

// Обробка відправки форми
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // Валідація всіх полів
    if (!inputs.name.value.trim() || inputs.name.value.trim().length < 2) {
        showError('name', inputs.name.value.trim().length === 0 ? 'Будь ласка, введіть ваше ім\'я' : 'Ім\'я повинно містити мінімум 2 символи');
        isValid = false;
    }
    
    if (!inputs.email.value.trim() || !validateEmail(inputs.email.value)) {
        showError('email');
        isValid = false;
    }
    
    if (!inputs.mobile.value.trim() || !validatePhone(inputs.mobile.value)) {
        showError('mobile');
        isValid = false;
    }
    
    if (!inputs.company.value.trim() || inputs.company.value.trim().length < 2) {
        showError('company', inputs.company.value.trim().length === 0 ? 'Будь ласка, введіть назву компанії' : 'Назва компанії повинна містити мінімум 2 символи');
        isValid = false;
    }

    if (!inputs.jobtitle.value.trim() || inputs.jobtitle.value.trim().length < 2) {
        showError('jobtitle', inputs.jobtitle.value.trim().length === 0 ? 'Будь ласка, вкажіть посаду' : 'Посада повинна містити мінімум 2 символи');
        isValid = false;
    }
    
    if (!inputs.country.value) {
        showError('country');
        isValid = false;
    }
    
    if (isValid) {
        // Тут можна відправити дані на сервер
        alert('Форма успішно відправлена!\n\n' +
              `Ім'я: ${inputs.name.value}\n` +
              `Email: ${inputs.email.value}\n` +
              `Телефон: +38 ${inputs.mobile.value}\n` +
              `Компанія: ${inputs.company.value}\n` +
                `Посада: ${inputs.jobtitle.value}\n` +
              `Країна: ${inputs.country.options[inputs.country.selectedIndex].text}\n` +
              `Contact: ${inputs.contact.value || 'не заповнено'}\n` +
              `UTM Source: ${inputs.utm_source.value || 'не заповнено'}`);
        
        //Очистити форму
        form.reset();
        Object.keys(inputs).forEach(key => {
            if (key !== 'contact' && key !== 'utm_source' && key !== 'countryValue') {
                clearValidation(key);
            }
        });
        
        // Відновити приховані поля після reset
        setHiddenFields();
    }
});