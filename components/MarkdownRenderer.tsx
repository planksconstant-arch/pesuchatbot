import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

const parseMarkdown = (text: string): string => {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '';
    let inUnorderedList = false;
    let inOrderedList = false;

    const closeLists = () => {
        if (inUnorderedList) {
            html += '</ul>';
            inUnorderedList = false;
        }
        if (inOrderedList) {
            html += '</ol>';
            inOrderedList = false;
        }
    };

    lines.forEach(line => {
        // Handle inline markdown first so it nests correctly
        let processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Block elements
        if (processedLine.startsWith('#### ')) {
            closeLists();
            html += `<h4 class="text-md font-bold mt-3 mb-1">${processedLine.substring(5)}</h4>`;
            return;
        }
        if (processedLine.startsWith('### ')) {
            closeLists();
            html += `<h3 class="text-lg font-bold mt-4 mb-2">${processedLine.substring(4)}</h3>`;
            return;
        }
        if (processedLine.startsWith('## ')) {
            closeLists();
            html += `<h2 class="text-xl font-bold mt-4 mb-2">${processedLine.substring(3)}</h2>`;
            return;
        }
        if (processedLine.trim() === '---') {
            closeLists();
            html += '<hr class="my-4 border-gray-600"/>';
            return;
        }
        
        const unorderedMatch = processedLine.match(/^(\s*)\*\s(.*)/);
        if (unorderedMatch) {
            if (inOrderedList) closeLists();
            if (!inUnorderedList) {
                html += '<ul class="space-y-1 list-disc pl-5">';
                inUnorderedList = true;
            }
            const indent = unorderedMatch[1].length;
            const content = unorderedMatch[2];
            html += `<li style="margin-left: ${indent * 8}px">${content}</li>`;
            return;
        }

        const orderedMatch = processedLine.match(/^(\s*)\d+\.\s(.*)/);
        if (orderedMatch) {
            if (inUnorderedList) closeLists();
            if (!inOrderedList) {
                html += '<ol class="space-y-1 list-decimal pl-5">';
                inOrderedList = true;
            }
            const indent = orderedMatch[1].length;
            const content = orderedMatch[2];
            html += `<li style="margin-left: ${indent * 8}px">${content}</li>`;
            return;
        }

        closeLists();

        if (processedLine.trim() !== '') {
            html += `<p>${processedLine}</p>`;
        }
    });

    closeLists();

    // Linkify URLs that might be in the text now
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    html = html.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>');

    return html;
};


export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const htmlContent = parseMarkdown(content);
    return <div className="whitespace-pre-wrap space-y-2" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};