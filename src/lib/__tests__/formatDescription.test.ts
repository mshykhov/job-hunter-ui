import { describe, expect, it } from "vitest";

import { formatDescription } from "../formatDescription";

describe("formatDescription", () => {
  describe("HTML detection", () => {
    it("passes through valid HTML content unchanged", () => {
      const html = "<p>Hello <strong>world</strong></p><ul><li>item</li></ul>";
      expect(formatDescription(html)).toBe(html);
    });

    it("preserves complex HTML structure", () => {
      const html = "<div><h2>Title</h2><p>Text</p><br><a href=\"https://example.com\">link</a></div>";
      const result = formatDescription(html);
      expect(result).toContain("<h2>Title</h2>");
      expect(result).toContain("<a href=\"https://example.com\">link</a>");
    });
  });

  describe("plain text formatting", () => {
    it("wraps plain text lines in paragraphs", () => {
      const text = "First line\nSecond line";
      const result = formatDescription(text);
      expect(result).toContain("<p>First line</p>");
      expect(result).toContain("<p>Second line</p>");
    });

    it("converts empty lines to line breaks", () => {
      const text = "Paragraph one\n\nParagraph two";
      const result = formatDescription(text);
      expect(result).toContain("<p>Paragraph one</p>");
      expect(result).toContain("<br>");
      expect(result).toContain("<p>Paragraph two</p>");
    });

    it("converts ** markers to bold", () => {
      const text = "**What we offer** Some benefits here";
      const result = formatDescription(text);
      expect(result).toContain("<strong>What we offer</strong>");
    });

    it("converts * bullet points to list items", () => {
      const text = "Requirements:\n* Java experience\n* Spring Boot\n* PostgreSQL";
      const result = formatDescription(text);
      expect(result).toContain("<ul>");
      expect(result).toContain("<li>Java experience</li>");
      expect(result).toContain("<li>Spring Boot</li>");
      expect(result).toContain("<li>PostgreSQL</li>");
      expect(result).toContain("</ul>");
    });

    it("converts bullet (•) markers to list items", () => {
      const text = "Skills:\n• Kotlin\n• React";
      const result = formatDescription(text);
      expect(result).toContain("<li>Kotlin</li>");
      expect(result).toContain("<li>React</li>");
    });

    it("closes list when non-list content follows", () => {
      const text = "List:\n* item 1\n* item 2\nNot a list item";
      const result = formatDescription(text);
      expect(result).toContain("</ul><p>Not a list item</p>");
    });

    it("escapes HTML entities in plain text", () => {
      const text = "Use <script> and & symbols";
      const result = formatDescription(text);
      expect(result).not.toContain("<script>");
      expect(result).toContain("&lt;script&gt;");
      expect(result).toContain("&amp;");
    });
  });

  describe("sanitization", () => {
    it("strips script tags from HTML input", () => {
      const html = "<p>Hello</p><script>alert('xss')</script>";
      const result = formatDescription(html);
      expect(result).not.toContain("<script>");
      expect(result).toContain("<p>Hello</p>");
    });

    it("strips event handlers from HTML input", () => {
      const html = '<p onmouseover="alert(1)">Text</p>';
      const result = formatDescription(html);
      expect(result).not.toContain("onmouseover");
    });
  });
});
