import fs from "node:fs";
import path from "node:path";

const FRONTMATTER_KEYS_TO_REMOVE = new Set(["summary", "read_when", "x-i18n"]);
const LINK_REWRITES = [
  ["/security/formal-verification/index", "/gateway/security/"],
  ["/reference/templates/AGENTS", "/reference/AGENTS.default"],
  ["/install/northflank", "/vps/"],
  ["/install/railway", "/vps/"],
  ["/gateway/security", "/gateway/security/"],
  ["/install/node", "/install/node/"],
  ["/channels", "/channels/"],
  ["/gateway", "/gateway/"],
  ["/install", "/install/"],
  ["/platforms", "/platforms/"],
  ["/nodes", "/nodes/"],
  ["/tools", "/tools/"],
  ["/help", "/help/"],
  ["/web", "/web/"],
  ["/cli", "/cli/"],
  ["http://localhost:18789/index", "http://127.0.0.1:18789/"],
];

function getMarkdownFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === ".vitepress" || entry.name === "node_modules" || entry.name === ".git") {
        continue;
      }

      files.push(...getMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function removeMintlifyFrontmatterFields(content, newline) {
  const lines = content.split(newline);

  if (lines.length < 3 || lines[0].trim() !== "---") {
    return content;
  }

  let closingIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      closingIndex = i;
      break;
    }
  }

  if (closingIndex === -1) {
    return content;
  }

  const frontmatterLines = lines.slice(1, closingIndex);
  const keptLines = [];

  for (let i = 0; i < frontmatterLines.length; ) {
    const line = frontmatterLines[i];
    const keyMatch = line.match(/^([ \t]*)([A-Za-z0-9_-]+):(.*)$/);

    if (keyMatch && keyMatch[1].length === 0 && FRONTMATTER_KEYS_TO_REMOVE.has(keyMatch[2])) {
      i += 1;

      while (i < frontmatterLines.length) {
        const nextLine = frontmatterLines[i];
        const nextTopLevelKey = nextLine.match(/^([ \t]*)([A-Za-z0-9_-]+):(.*)$/);

        if (nextTopLevelKey && nextTopLevelKey[1].length === 0) {
          break;
        }

        i += 1;
      }

      continue;
    }

    keptLines.push(line);
    i += 1;
  }

  while (keptLines.length > 0 && keptLines[0].trim() === "") {
    keptLines.shift();
  }

  while (keptLines.length > 0 && keptLines[keptLines.length - 1].trim() === "") {
    keptLines.pop();
  }

  return ["---", ...keptLines, "---", ...lines.slice(closingIndex + 1)].join(newline);
}

function readBalancedBraces(input, openBraceIndex) {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let i = openBraceIndex; i < input.length; i += 1) {
    const char = input[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (inSingle) {
      if (char === "\\") {
        escaped = true;
      } else if (char === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inDouble = false;
      }
      continue;
    }

    if (inTemplate) {
      if (char === "\\") {
        escaped = true;
      } else if (char === "`") {
        inTemplate = false;
      }
      continue;
    }

    if (char === "'") {
      inSingle = true;
      continue;
    }

    if (char === '"') {
      inDouble = true;
      continue;
    }

    if (char === "`") {
      inTemplate = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return {
          expression: input.slice(openBraceIndex + 1, i),
          closeBraceIndex: i,
        };
      }
    }
  }

  return null;
}

function isAttrNameStart(char) {
  return /[A-Za-z_:]/.test(char);
}

function isAttrNameChar(char) {
  return /[A-Za-z0-9_:.\-]/.test(char);
}

function convertJsxExpressionProps(attrs) {
  let output = "";
  let index = 0;

  while (index < attrs.length) {
    const char = attrs[index];
    const atAttributeBoundary = index === 0 || /\s/.test(attrs[index - 1]);

    if (atAttributeBoundary && isAttrNameStart(char)) {
      let nameEnd = index + 1;
      while (nameEnd < attrs.length && isAttrNameChar(attrs[nameEnd])) {
        nameEnd += 1;
      }

      const attrName = attrs.slice(index, nameEnd);
      let afterName = nameEnd;

      while (afterName < attrs.length && /\s/.test(attrs[afterName])) {
        afterName += 1;
      }

      if (attrs[afterName] === "=" && attrs[afterName + 1] === "{") {
        const balanced = readBalancedBraces(attrs, afterName + 1);

        if (balanced) {
          const vueAttrName = attrName === "defaultOpen" ? "default-open" : attrName;
          const escapedExpression = balanced.expression.trim().replace(/"/g, "&quot;");
          output += `:${vueAttrName}="${escapedExpression}"`;
          index = balanced.closeBraceIndex + 1;
          continue;
        }
      }
    }

    output += char;
    index += 1;
  }

  return output;
}

function convertDefaultOpenBoolean(attrs) {
  return attrs.replace(/(^|\s)defaultOpen(?=(?:\s|\/|$))/g, "$1:default-open=\"true\"");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeInternalLinks(text) {
  let output = text;

  for (const [from, to] of LINK_REWRITES) {
    const pattern = new RegExp(`${escapeRegex(from)}(?=([)\\]\"'\\s<#?]|$))`, "g");
    output = output.replace(pattern, to);
  }

  return output;
}

function escapeInlineCodeAngles(codeSpan) {
  let tickCount = 0;
  while (tickCount < codeSpan.length && codeSpan[tickCount] === "`") {
    tickCount += 1;
  }

  if (tickCount === 0 || codeSpan.length < tickCount * 2) {
    return codeSpan;
  }

  const head = codeSpan.slice(0, tickCount);
  const body = codeSpan
    .slice(tickCount, codeSpan.length - tickCount)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{\{/g, "&#123;&#123;")
    .replace(/\}\}/g, "&#125;&#125;");
  const tail = codeSpan.slice(codeSpan.length - tickCount);
  return `${head}${body}${tail}`;
}

function sanitizeVueBindingQuotes(attrs) {
  let output = "";

  for (let i = 0; i < attrs.length; ) {
    if (attrs[i] !== ":") {
      output += attrs[i];
      i += 1;
      continue;
    }

    if (!isAttrNameStart(attrs[i + 1] ?? "")) {
      output += attrs[i];
      i += 1;
      continue;
    }

    let nameEnd = i + 2;
    while (nameEnd < attrs.length && isAttrNameChar(attrs[nameEnd])) {
      nameEnd += 1;
    }

    let equalsIndex = nameEnd;
    while (equalsIndex < attrs.length && /\s/.test(attrs[equalsIndex])) {
      equalsIndex += 1;
    }

    if (attrs[equalsIndex] !== "=" || attrs[equalsIndex + 1] !== '"') {
      output += attrs[i];
      i += 1;
      continue;
    }

    output += attrs.slice(i, equalsIndex + 2);
    i = equalsIndex + 2;
    let braceDepth = 0;

    while (i < attrs.length) {
      const char = attrs[i];
      if (char !== '"') {
        if (char === "{") {
          braceDepth += 1;
        } else if (char === "}" && braceDepth > 0) {
          braceDepth -= 1;
        }

        output += char;
        i += 1;
        continue;
      }

      const nextChar = attrs[i + 1];
      if (braceDepth === 0 && (nextChar === undefined || /\s|\//.test(nextChar))) {
        output += '"';
        i += 1;
        break;
      }

      output += "&quot;";
      i += 1;
    }
  }

  return output;
}

function maskInlineCode(text) {
  const placeholders = [];
  let output = "";

  for (let i = 0; i < text.length; ) {
    if (text[i] !== "`") {
      output += text[i];
      i += 1;
      continue;
    }

    let tickCount = 1;
    while (i + tickCount < text.length && text[i + tickCount] === "`") {
      tickCount += 1;
    }

    const fence = "`".repeat(tickCount);
    const closeIndex = text.indexOf(fence, i + tickCount);

    if (closeIndex === -1) {
      output += text[i];
      i += 1;
      continue;
    }

    const token = `@@INLINE_CODE_${placeholders.length}@@`;
    placeholders.push(escapeInlineCodeAngles(text.slice(i, closeIndex + tickCount)));
    output += token;
    i = closeIndex + tickCount;
  }

  return { output, placeholders };
}

function unmaskInlineCode(text, placeholders) {
  let restored = text;

  for (let i = 0; i < placeholders.length; i += 1) {
    restored = restored.replace(`@@INLINE_CODE_${i}@@`, placeholders[i]);
  }

  return restored;
}

function transformMarkupSegment(segment) {
  const { output: maskedSegment, placeholders } = maskInlineCode(segment);
  const normalizedLinks = normalizeInternalLinks(maskedSegment);

  const withPreCodeGuards = normalizedLinks.replace(
    /<pre(?![^>]*\bv-pre\b)([^>]*)><code/g,
    "<pre$1 v-pre><code",
  );

  const transformed = withPreCodeGuards.replace(
    /<([A-Za-z][\w:-]*)([^<>]*?)(\/?)>/g,
    (_fullTag, tagName, attrs, selfClosingSlash) => {
      let nextAttrs = attrs;
      nextAttrs = convertJsxExpressionProps(nextAttrs);
      nextAttrs = convertDefaultOpenBoolean(nextAttrs);
      nextAttrs = sanitizeVueBindingQuotes(nextAttrs);

      if (selfClosingSlash === "/" && /^[A-Z]/.test(tagName)) {
        return `<${tagName}${nextAttrs}></${tagName}>`;
      }

      return `<${tagName}${nextAttrs}${selfClosingSlash}>`;
    },
  );

  return unmaskInlineCode(transformed, placeholders);
}

function isFenceLine(line) {
  return line.match(/^\s*(`{3,}|~{3,})/);
}

function isFenceCloser(line, markerChar, markerLength) {
  const match = line.match(/^\s*(`{3,}|~{3,})\s*$/);
  return Boolean(match) && match[1][0] === markerChar && match[1].length >= markerLength;
}

function countLeadingSpaces(line) {
  let count = 0;
  while (count < line.length && line[count] === " ") {
    count += 1;
  }
  return count;
}

function dedentLine(line, amount) {
  if (amount <= 0) {
    return line;
  }

  let removed = 0;
  while (removed < amount && removed < line.length && line[removed] === " ") {
    removed += 1;
  }
  return line.slice(removed);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripInlineCodeForTagScan(line) {
  let output = "";

  for (let i = 0; i < line.length; ) {
    if (line[i] !== "`") {
      output += line[i];
      i += 1;
      continue;
    }

    let tickCount = 1;
    while (i + tickCount < line.length && line[i + tickCount] === "`") {
      tickCount += 1;
    }

    const fence = "`".repeat(tickCount);
    const closeIndex = line.indexOf(fence, i + tickCount);
    if (closeIndex === -1) {
      output += line[i];
      i += 1;
      continue;
    }

    i = closeIndex + tickCount;
  }

  return output;
}

function getCustomComponentDepthDelta(line) {
  const scanLine = stripInlineCodeForTagScan(line);
  const tagRegex = /<\/?([A-Z][\w:-]*)([^<>]*?)(\/?)>/g;
  let depthDelta = 0;

  for (const match of scanLine.matchAll(tagRegex)) {
    const fullTag = match[0];
    const selfClosing = match[3] === "/";
    const isClosing = fullTag.startsWith("</");

    if (isClosing) {
      depthDelta -= 1;
    } else if (!selfClosing) {
      depthDelta += 1;
    }
  }

  return depthDelta;
}

function normalizeComponentIndentation(content, newline) {
  const lines = content.split(newline);
  const output = [];

  let customComponentDepth = 0;
  let inRegularFence = false;
  let regularFenceMarkerChar = "";
  let regularFenceMarkerLength = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    let line = lines[lineIndex];

    if (inRegularFence) {
      output.push(line);
      if (isFenceCloser(line, regularFenceMarkerChar, regularFenceMarkerLength)) {
        inRegularFence = false;
        regularFenceMarkerChar = "";
        regularFenceMarkerLength = 0;
      }
      continue;
    }

    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const fenceIndent = fenceMatch[1].length;
      const fenceMarker = fenceMatch[2];
      const fenceLang = fenceMatch[3].trim().split(/\s+/)[0] ?? "";

      if (customComponentDepth > 0) {
        const dedentAmount = fenceIndent;
        const codeLines = [];

        for (lineIndex += 1; lineIndex < lines.length; lineIndex += 1) {
          const candidateLine = lines[lineIndex];
          const candidateDedented = dedentLine(candidateLine, dedentAmount);

          if (
            isFenceCloser(candidateDedented, fenceMarker[0], fenceMarker.length) ||
            isFenceCloser(candidateLine, fenceMarker[0], fenceMarker.length)
          ) {
            break;
          }

          codeLines.push(candidateDedented);
        }

        const safeLang = fenceLang.replace(/[^A-Za-z0-9_-]/g, "");
        const codeClass = safeLang.length > 0 ? ` class=\"language-${safeLang}\"` : "";
        const blockIndent = " ".repeat(Math.min(fenceIndent, 2));

        output.push(`${blockIndent}<pre v-pre><code${codeClass}>`);
        output.push(escapeHtml(codeLines.join(newline)));
        output.push(`${blockIndent}</code></pre>`);
        continue;
      }

      output.push(line);
      inRegularFence = true;
      regularFenceMarkerChar = fenceMarker[0];
      regularFenceMarkerLength = fenceMarker.length;
      continue;
    }

    if (customComponentDepth > 0) {
      const leadingSpaces = countLeadingSpaces(line);
      const trimmed = line.trimStart();
      if (leadingSpaces > 2 && trimmed.length > 0) {
        line = `  ${line.slice(leadingSpaces)}`;
      }
    }

    output.push(line);

    customComponentDepth += getCustomComponentDepthDelta(line);
    if (customComponentDepth < 0) {
      customComponentDepth = 0;
    }
  }

  return output.join(newline);
}

function transformOutsideCodeFences(content, newline) {
  const lines = content.split(newline);
  const chunks = [];
  let pendingText = [];
  let pendingFence = [];
  let inFence = false;
  let fenceMarkerChar = "";
  let fenceMarkerLength = 0;

  const flushText = () => {
    if (pendingText.length === 0) {
      return;
    }

    chunks.push(transformMarkupSegment(pendingText.join(newline)));
    pendingText = [];
  };

  const flushFence = () => {
    if (pendingFence.length === 0) {
      return;
    }

    chunks.push(pendingFence.join(newline));
    pendingFence = [];
  };

  for (const line of lines) {
    if (!inFence) {
      const opener = isFenceLine(line);
      if (opener) {
        flushText();

        inFence = true;
        fenceMarkerChar = opener[1][0];
        fenceMarkerLength = opener[1].length;
        pendingFence.push(line);
        continue;
      }

      pendingText.push(line);
      continue;
    }

    pendingFence.push(line);
    if (isFenceCloser(line, fenceMarkerChar, fenceMarkerLength)) {
      inFence = false;
      fenceMarkerChar = "";
      fenceMarkerLength = 0;
      flushFence();
    }
  }

  if (inFence) {
    flushText();
    flushFence();
  } else {
    flushFence();
    flushText();
  }

  return chunks.join(newline);
}

function transformMarkdown(content) {
  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  let next = removeMintlifyFrontmatterFields(content, newline);
  next = normalizeComponentIndentation(next, newline);
  next = transformOutsideCodeFences(next, newline);
  return next;
}

function main() {
  const docsDir = path.resolve(process.argv[2] ?? "docs");
  const markdownFiles = getMarkdownFiles(docsDir);
  let changedCount = 0;

  for (const filePath of markdownFiles) {
    const original = fs.readFileSync(filePath, "utf8");
    const transformed = transformMarkdown(original);

    if (transformed !== original) {
      fs.writeFileSync(filePath, transformed, "utf8");
      changedCount += 1;
    }
  }

  console.log(`[transform-mintlify-to-vitepress] scanned=${markdownFiles.length} changed=${changedCount}`);
}

main();
