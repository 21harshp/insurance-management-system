import { toast } from 'react-toastify';

export const successMessage = (message) => {
    toast.success(message, {
        autoClose: 5000,
        position: 'top-right',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
}

export const errorMessage = (message) => {
    toast.error(message, {
        autoClose: 5000,
        position: 'top-right',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
}