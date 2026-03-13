import DOMPurify from "dompurify";

const HTML_TAG_PATTERN = /<(?:p|div|br|ul|ol|li|h[1-6]|table|tr|td|th|strong|em|b|i|a|span|section|article|header|footer|blockquote)\b[^>]*>/i;

const isHtml = (text: string): boolean => HTML_TAG_PATTERN.test(text);

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatPlainText = (text: string): string => {
  const escaped = escapeHtml(text);

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const withMarkers = withBold.replace(/(?:^|\n)\s*[*•]\s+/g, "\n• ");

  const lines = withMarkers.split("\n");
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("• ")) {
      if (!inList) {
        result.push("<ul>");
        inList = true;
      }
      result.push(`<li>${trimmed.slice(2)}</li>`);
    } else {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }

      if (trimmed === "") {
        result.push("<br>");
      } else {
        result.push(`<p>${trimmed}</p>`);
      }
    }
  }

  if (inList) result.push("</ul>");

  return result.join("");
};

export const formatDescription = (description: string): string => {
  const formatted = isHtml(description)
    ? description
    : formatPlainText(description);

  return DOMPurify.sanitize(formatted);
};
