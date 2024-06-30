import Swal from 'sweetalert2';

export function showSuccessAlert(title, text) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
    });
}

export function showErrorAlert(title, text) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
    });
}

export function showWarningAlert(title, text, confirmButtonText, onConfirm) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
}

export function showLoadingAlert(title = 'Loading', text = 'Please wait...') {
    Swal.fire({
        title: title,
        text: text,
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

export function hideLoadingAlert() {
    Swal.close();
}
