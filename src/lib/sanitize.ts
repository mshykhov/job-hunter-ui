import DOMPurify from "dompurify";

export const sanitizeHtml = (dirty: string): string => DOMPurify.sanitize(dirty);
