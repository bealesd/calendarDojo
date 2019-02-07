class FormHelper {
    static hideForm(formId) {
        document.getElementById(formId).style.display = 'none';
    }

    static showForm(formId) {
        document.getElementById(formId).style.display = 'block';
    }
};