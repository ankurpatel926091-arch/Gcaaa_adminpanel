import Swal from 'sweetalert2';

const baseSwal = Swal.mixin({
  confirmButtonColor: '#700018',
  cancelButtonColor: '#6b7280',
  reverseButtons: true,
  focusCancel: true,
  customClass: {
    popup: 'rounded-2xl',
  },
});

export const confirmDelete = (
  title = 'Delete this item?',
  text = 'This action cannot be undone.'
) =>
  baseSwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
  });

export const showSuccess = (title = 'Success!', text = '') =>
  baseSwal.fire({
    icon: 'success',
    title,
    text,
    timer: 1800,
    showConfirmButton: false,
  });

export const showError = (title = 'Error', text = 'Something went wrong.') =>
  baseSwal.fire({
    icon: 'error',
    title,
    text,
  });

export const showLoading = (title = 'Please wait...') =>
  baseSwal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

export const closeLoading = () => Swal.close();

export default baseSwal;