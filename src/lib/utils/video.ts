/**
 * Converts a YouTube URL (regular or short) to an embed URL.
 * @param url The YouTube URL to convert.
 * @returns The embed URL, or the original if it couldn't be converted.
 */
export function getYoutubeEmbedUrl(url: string): string {
    if (!url) return "";
    
    // Already an embed URL
    if (url.includes("/embed/")) return url;

    // Handle youtu.be short links
    const shortLinkMatch = url.match(/youtu\.be\/([^?&#/]+)/);
    if (shortLinkMatch) {
        const id = shortLinkMatch[1];
        const params = url.split("?")[1] || "";
        return `https://www.youtube.com/embed/${id}${params ? "?" + params : ""}`;
    }

    // Handle YouTube Shorts
    const shortsMatch = url.match(/\/shorts\/([^?&#/]+)/);
    if (shortsMatch) {
        const id = shortsMatch[1];
        const params = url.split("?")[1] || "";
        return `https://www.youtube.com/embed/${id}${params ? "?" + params : ""}`;
    }

    // Handle regular watch links
    const watchLinkMatch = url.match(/[?&]v=([^?&#/]+)/);
    if (watchLinkMatch) {
        const id = watchLinkMatch[1];
        const params = url.split("?")[1]?.split("&").filter(p => !p.startsWith("v=")).join("&") || "";
        return `https://www.youtube.com/embed/${id}${params ? "?" + params : ""}`;
    }

    return url;
}
