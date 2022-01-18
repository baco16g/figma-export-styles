import { Api as FigmaAPI, Node } from 'figma-api';

export const listTypographies = async (token: string, fileId: string) => {
  const api = new FigmaAPI({
    personalAccessToken: token,
  });
  const typographies = await api
    .getFileStyles(fileId)
    .then(
      (data) =>
        data.meta?.styles.filter((style) => style.style_type === 'TEXT') || [],
    );
  return api
    .getFileNodes(
      fileId,
      typographies.map((t) => t.node_id),
    )
    .then((file) =>
      Object.entries(file.nodes)
        .map((node) => [node[0], node[1]?.document as unknown as Node<'TEXT'>])
        .filter((node): node is [string, Node<'TEXT'>] => !!node[1])
        .map(mapTextNode),
    );
};

const mapTextNode = ([nodeId, node]: [string, Node<'TEXT'>]) => {
  return {
    nodeId,
    styleName: node.name,
    fontFamily: node.style.fontFamily,
    fontSize: `${node.style.fontSize / 10}rem`,
    fontWeight: node.style.fontWeight,
    letterSpacing: node.style.letterSpacing,
    lineHeight: Math.round(node.style.lineHeightPercentFontSize || 100) / 100,
  };
};
