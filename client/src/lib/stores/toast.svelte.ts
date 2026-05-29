type Toast = {
	id: number;
	message: string;
	type: 'success' | 'error';
};

let toasts = $state<Toast[]>([]);

export const addToast = (message: string, type: Toast['type'] = 'success') => {
	const id = Date.now();
	toasts.push({ id, message, type });
	setTimeout(() => removeToast(id), 3000);
};

export const removeToast = (id: number) => {
	toasts = toasts.filter((t) => t.id !== id);
};

export const getToasts = () => toasts;
