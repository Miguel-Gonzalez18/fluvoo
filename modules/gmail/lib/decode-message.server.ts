interface GmailHeader {
  name?: string;
  value?: string;
}

interface GmailMessagePart {
  mimeType?: string;
  body?: { data?: string; size?: number };
  parts?: GmailMessagePart[];
  headers?: GmailHeader[];
}

export interface GmailMessagePayload {
  id: string;
  threadId?: string;
  internalDate?: string;
  snippet?: string;
  payload?: GmailMessagePart;
}

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf-8");
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPartBody(part: GmailMessagePart): string {
  if (part.body?.data) {
    const decoded = decodeBase64Url(part.body.data);
    if (part.mimeType?.includes("html")) {
      return stripHtml(decoded);
    }
    return decoded;
  }

  if (part.parts?.length) {
    const plain = part.parts.find((child) => child.mimeType === "text/plain");
    if (plain) return extractPartBody(plain);

    const html = part.parts.find((child) => child.mimeType === "text/html");
    if (html) return extractPartBody(html);

    return part.parts.map(extractPartBody).join("\n");
  }

  return "";
}

export function getGmailHeader(
  message: GmailMessagePayload,
  headerName: string
): string | undefined {
  const headers = message.payload?.headers ?? [];
  const match = headers.find(
    (header) => header.name?.toLowerCase() === headerName.toLowerCase()
  );
  return match?.value;
}

export function extractGmailMessageBody(message: GmailMessagePayload): string {
  if (!message.payload) {
    return message.snippet ?? "";
  }

  const body = extractPartBody(message.payload);
  return body || message.snippet || "";
}

export function getGmailMessageDate(message: GmailMessagePayload): Date {
  if (message.internalDate) {
    return new Date(Number(message.internalDate));
  }

  const dateHeader = getGmailHeader(message, "Date");
  if (dateHeader) {
    const parsed = new Date(dateHeader);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return new Date();
}
