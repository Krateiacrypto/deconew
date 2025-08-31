export const markdownToHtml = (markdown: string): string => {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
    
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-emerald-600 hover:text-emerald-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" class="w-full h-auto rounded-lg my-4" />')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-emerald-50 italic text-gray-700">$1</blockquote>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="mb-2">$1</li>')
    
    // Line breaks
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, '<br>')
    
    // Wrap in paragraphs
    .replace(/^(?!<[h|l|b|p|d])/gim, '<p class="mb-4">')
    .replace(/(?<!>)$/gim, '</p>');
};

export const htmlToMarkdown = (html: string): string => {
  return html
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gim, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gim, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gim, '### $1\n\n')
    
    // Bold and Italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gim, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gim, '*$1*')
    
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gim, '[$2]($1)')
    
    // Images
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gim, '![$1]($2)')
    
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gim, '> $1\n\n')
    
    // Code
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gim, '```\n$1\n```\n\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gim, '`$1`')
    
    // Lists
    .replace(/<li[^>]*>(.*?)<\/li>/gim, '- $1\n')
    
    // Paragraphs and breaks
    .replace(/<p[^>]*>/gim, '')
    .replace(/<\/p>/gim, '\n\n')
    .replace(/<br\s*\/?>/gim, '\n')
    
    // Clean up extra whitespace
    .replace(/\n{3,}/gim, '\n\n')
    .trim();
};

export const extractExcerpt = (content: string, maxLength: number = 200): string => {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};