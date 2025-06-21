export const lexicalToText = (content: any): string => {
    if (!content?.root?.children) return "";

    let text = '';

    const traverse = (node: any) => {
        if (node.type === 'text') {
            text += node.text;
        } else if (node.children) {
            node.children.forEach(traverse);
        }
    };

    content.root.children.forEach(traverse);

    return text;
}