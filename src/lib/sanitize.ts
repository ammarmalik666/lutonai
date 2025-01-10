import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
    });
}; 